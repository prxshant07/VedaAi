'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'

import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  X,
} from 'lucide-react'

interface Toast {
  id: string

  message: string

  type:
    | 'default'
    | 'success'
    | 'error'
}

interface ToastContextValue {
  toast: (
    message: string,
    type?: Toast['type']
  ) => void
}

const ToastContext =
  createContext<ToastContextValue>({
    toast: () => {},
  })

export function ToastProvider({
  children,
}: {
  children: ReactNode
}) {
  const [toasts, setToasts] = useState<
    Toast[]
  >([])

  const removeToast = (
    id: string
  ) => {
    setToasts((prev) =>
      prev.filter((t) => t.id !== id)
    )
  }

  const toast = useCallback(
    (
      message: string,
      type: Toast['type'] =
        'default'
    ) => {
      const id = Math.random()
        .toString(36)
        .slice(2)

      setToasts((prev) => [
        ...prev,
        {
          id,
          message,
          type,
        },
      ])

      setTimeout(() => {
        removeToast(id)
      }, 3500)
    },
    []
  )

  const typeStyles: Record<
    Toast['type'],
    {
      container: string
      icon: React.ReactNode
    }
  > = {
    default: {
      container:
        'border-violet-200 bg-white/90 text-textPrimary backdrop-blur-xl',

      icon: (
        <Sparkles
          size={18}
          className="text-violet-600"
        />
      ),
    },

    success: {
      container:
        'border-emerald-200 bg-emerald-50/90 text-emerald-800 backdrop-blur-xl',

      icon: (
        <CheckCircle2
          size={18}
          className="text-emerald-600"
        />
      ),
    },

    error: {
      container:
        'border-red-200 bg-red-50/90 text-red-800 backdrop-blur-xl',

      icon: (
        <AlertCircle
          size={18}
          className="text-red-600"
        />
      ),
    },
  }

  return (
    <ToastContext.Provider
      value={{ toast }}
    >
      {children}

      {/* Toast Stack */}
      <div
        className="
          pointer-events-none
          fixed
          bottom-5
          right-5
          z-[100]
          flex
          w-full
          max-w-sm
          flex-col
          gap-3
          px-4
          sm:px-0
        "
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
              pointer-events-auto
              group
              relative
              overflow-hidden
              rounded-[24px]
              border
              px-5
              py-4
              shadow-2xl
              transition-all
              duration-300
              animate-fade-in
              ${typeStyles[t.type].container}
            `}
          >
            {/* Glow */}
            <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/40 blur-3xl" />

            <div className="relative z-10 flex items-start gap-3">
              {/* Icon */}
              <div
                className="
                  mt-0.5
                  flex
                  h-9
                  w-9
                  flex-shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white/70
                  shadow-sm
                "
              >
                {
                  typeStyles[t.type]
                    .icon
                }
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-relaxed">
                  {t.message}
                </p>
              </div>

              {/* Close */}
              <button
                onClick={() =>
                  removeToast(t.id)
                }
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-xl
                  text-zinc-400
                  opacity-0
                  transition-all
                  hover:bg-white/60
                  hover:text-zinc-700
                  group-hover:opacity-100
                "
              >
                <X size={16} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/50">
              <div
                className="
                  h-full
                  animate-shimmer
                  rounded-full
                  bg-gradient-to-r
                  from-violet-500
                  to-fuchsia-500
                "
              />
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}