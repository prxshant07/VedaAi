import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { IGeneratedPaper } from '../models/GeneratedPaper';

function escapeHTML(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildPaperHTML(paper: IGeneratedPaper): string {
  const sectionLetters = 'ABCDEFGHIJ';

  const sectionsHTML = paper.sections
    .map((section, si) => {
      const letter = sectionLetters[si] || String(si + 1);

      const questionsHTML = section.questions
        .map((q, qi) => {
          const optionsHTML =
            q.options && q.options.length
              ? `<ul class="options">${q.options.map(o => `<li>${escapeHTML(o)}</li>`).join('')}</ul>`
              : '';

          const answerLines =
            q.type === 'long'
              ? Array(6).fill('<div class="answer-line"></div>').join('')
              : q.type === 'short'
              ? Array(3).fill('<div class="answer-line"></div>').join('')
              : '';

          const difficultyClass = `difficulty-${q.difficulty}`;

          return `
          <div class="question">
            <div class="question-header">
              <span class="question-num">Q${qi + 1}.</span>
              <div class="question-body">
                <p class="question-text">${escapeHTML(q.question)}</p>
                ${optionsHTML}
                ${answerLines}
                <div class="question-meta">
                  <span class="difficulty-badge ${difficultyClass}">${escapeHTML(q.difficulty)}</span>
                  <span class="marks">[${q.marks} mark${q.marks !== 1 ? 's' : ''}]</span>
                </div>
              </div>
            </div>
          </div>`;
        })
        .join('');

      return `
      <div class="section">
        <div class="section-header">
          <strong>Section ${letter}: ${escapeHTML(section.title)}</strong>
          <em>${escapeHTML(section.instruction)}</em>
        </div>
        ${questionsHTML}
      </div>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Times New Roman', Georgia, serif;
      font-size: 12pt;
      color: #000;
      background: #fff;
      padding: 40px 50px;
      line-height: 1.6;
    }
    .paper-header {
      text-align: center;
      border-bottom: 2px solid #000;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .paper-title { font-size: 18pt; font-weight: bold; margin-bottom: 6px; }
    .paper-meta { font-size: 10pt; color: #555; }
    .student-fields {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 12px; margin-bottom: 28px;
    }
    .student-field {
      border-bottom: 1px solid #666;
      padding: 14px 0 3px;
      font-size: 10pt; color: #666;
    }
    .section { margin-bottom: 28px; page-break-inside: avoid; }
    .section-header {
      background: #f5f5f5;
      padding: 8px 14px;
      border-radius: 4px;
      margin-bottom: 14px;
      font-size: 11pt;
    }
    .section-header em { display: block; font-size: 9.5pt; color: #555; margin-top: 2px; }
    .question {
      padding: 10px 0;
      border-bottom: 1px solid #eee;
      page-break-inside: avoid;
    }
    .question:last-child { border-bottom: none; }
    .question-header { display: flex; gap: 10px; }
    .question-num { font-size: 10pt; color: #888; min-width: 22px; padding-top: 1px; font-family: 'Courier New', monospace; }
    .question-body { flex: 1; }
    .question-text { font-size: 11.5pt; margin-bottom: 8px; }
    .options { list-style: none; margin: 0 0 8px; padding: 0; }
    .options li { font-size: 11pt; padding: 2px 0; color: #333; }
    .answer-line {
      border-bottom: 1px solid #ccc;
      height: 24px; margin-bottom: 3px;
    }
    .question-meta {
      display: flex; align-items: center; gap: 8px; margin-top: 8px;
    }
    .difficulty-badge {
      font-size: 8.5pt; padding: 2px 7px; border-radius: 4px;
      font-family: Arial, sans-serif; font-weight: bold;
    }
    .difficulty-easy { background: #dcfce7; color: #166534; }
    .difficulty-medium { background: #fef9c3; color: #854d0e; }
    .difficulty-hard { background: #fee2e2; color: #991b1b; }
    .marks { margin-left: auto; font-size: 9.5pt; color: #888; font-family: 'Courier New', monospace; }
    .paper-footer {
      margin-top: 32px; padding-top: 12px;
      border-top: 1px solid #eee;
      text-align: center;
      font-size: 8pt; color: #bbb;
      font-family: Arial, sans-serif;
    }
    @page { margin: 20mm 25mm; size: A4; }
  </style>
</head>
<body>
  <div class="paper-header">
    <div class="paper-title">${escapeHTML(paper.title)}</div>
    <div class="paper-meta">
      Total Marks: ${paper.totalMarks} &nbsp;|&nbsp;
      Questions: ${paper.totalQuestions} &nbsp;|&nbsp;
      Time Allowed: ${Math.max(30, paper.totalQuestions * 3)} minutes
    </div>
  </div>

  <div class="student-fields">
    <div class="student-field">Name: ___________________________</div>
    <div class="student-field">Student ID: ______________________</div>
    <div class="student-field">Date: ___________________________</div>
    <div class="student-field">Score: _________ / ${paper.totalMarks}</div>
  </div>

  ${sectionsHTML}

  <div class="paper-footer">
    Generated with Examify AI &nbsp;·&nbsp;
    ${new Date(paper.generatedAt).toLocaleDateString('en-GB')} &nbsp;·&nbsp;
    Model: ${escapeHTML(paper.metadata?.model ?? 'gpt-4o')}
  </div>
</body>
</html>`;
}

export async function generatePDF(paper: IGeneratedPaper): Promise<Buffer> {
  const executablePath = await chromium.executablePath();

  const browser = await puppeteer.launch({
    headless: true,
    executablePath,
    args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    defaultViewport: chromium.defaultViewport,
  });

  try {
    const page = await browser.newPage();
    const html = buildPaperHTML(paper);

    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
      printBackground: true,
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}
