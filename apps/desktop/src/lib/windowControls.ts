/**
 * Deraza boshqaruvi: minimize / maximize / close.
 *
 * Desktop qobig'i (Tauri yoki Electron) mavjud bo'lganda tugmalar avtomatik
 * ishlaydi — kod o'zgarmaydi. Brauzer preview'da esa xavfsiz no-op:
 * na xatolik tashlanadi, na deraza harakati bajariladi.
 */

type ElectronAPI = {
  minimize?: () => void
  maximize?: () => void
  close?: () => void
}

type TauriWindowActions = {
  minimize: () => Promise<void>
  toggleMaximize: () => Promise<void>
  close: () => Promise<void>
}

/**
 * Tauri o'z belgisini globalga o'rnatadi: v2 — `__TAURI_INTERNALS__`,
 * v1 — `__TAURI_IPC__`. Ikkalasi ham yo'q bo'lsa, oddiy brauzer preview.
 * `window` mavjud bo'lmagan muhitda (SSR/test) ham xavfsiz qaytamiz.
 */
function isTauri(): boolean {
  if (typeof window === 'undefined') return false
  const w = window as unknown as {
    __TAURI_INTERNALS__?: unknown
    __TAURI_IPC__?: unknown
  }
  return Boolean(w.__TAURI_INTERNALS__) || Boolean(w.__TAURI_IPC__)
}

function electron(): ElectronAPI | undefined {
  if (typeof window === 'undefined') return undefined
  return (window as unknown as { electronAPI?: ElectronAPI }).electronAPI
}

/**
 * Tauri API chaqiruvi. Global bo'lmasa yoki modul/chaqiruv ishlamasa,
 * xatolikni yutib, jim qaytamiz — preview uchun xavfsiz async no-op.
 */
async function tauriCall(action: keyof TauriWindowActions): Promise<void> {
  if (!isTauri()) return
  try {
    const { getCurrentWindow } = await import('@tauri-apps/api/window')
    const win = getCurrentWindow() as unknown as TauriWindowActions
    await win[action]()
  } catch {
    /* qobiq yo'q yoki nosoz: xavfsiz no-op */
  }
}

/** Tugmalar haqiqatan ishlaydimi (desktop qobig'i bormi) */
export function controlsAvailable(): boolean {
  if (typeof window === 'undefined') return false
  return isTauri() || Boolean(electron()?.minimize)
}

export async function minimizeWindow(): Promise<void> {
  const e = electron()
  if (e?.minimize) {
    try {
      e.minimize()
    } catch {
      /* nosoz qobiq: xavfsiz no-op */
    }
    return
  }
  await tauriCall('minimize')
}

export async function maximizeWindow(): Promise<void> {
  const e = electron()
  if (e?.maximize) {
    try {
      e.maximize()
    } catch {
      /* nosoz qobiq: xavfsiz no-op */
    }
    return
  }
  await tauriCall('toggleMaximize')
}

export async function closeWindow(): Promise<void> {
  const e = electron()
  if (e?.close) {
    try {
      e.close()
    } catch {
      /* nosoz qobiq: xavfsiz no-op */
    }
    return
  }
  await tauriCall('close')
}
