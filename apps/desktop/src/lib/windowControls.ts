/**
 * Deraza boshqaruvi: minimize / maximize / close.
 *
 * Desktop qobig'i (Tauri yoki Electron) qo'shilganda tugmalar avtomatik
 * ishlaydi — kod o'zgarmaydi. Hozircha (brauzer preview) xavfsiz fallback:
 * kattalashtirish to'liq ekran, qolganlari disabled.
 */

type ElectronAPI = {
  minimize?: () => void
  maximize?: () => void
  close?: () => void
}

function isTauri(): boolean {
  return '__TAURI_INTERNALS__' in window
}

function electron(): ElectronAPI | undefined {
  return (window as unknown as { electronAPI?: ElectronAPI }).electronAPI
}

/** Tugmalar haqiqatan ishlaydimi (desktop qobig'i bormi) */
export function controlsAvailable(): boolean {
  return isTauri() || Boolean(electron()?.minimize)
}

export async function minimizeWindow(): Promise<void> {
  const e = electron()
  if (e?.minimize) return e.minimize()
  if (!isTauri()) return
  const { getCurrentWindow } = await import('@tauri-apps/api/window')
  await getCurrentWindow().minimize()
}

export async function maximizeWindow(): Promise<void> {
  const e = electron()
  if (e?.maximize) return e.maximize()

  if (isTauri()) {
    const { getCurrentWindow } = await import('@tauri-apps/api/window')
    await getCurrentWindow().toggleMaximize()
    return
  }

  // Brauzer preview: kattalashtirish = to'liq ekran
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen()
    else await document.exitFullscreen()
  } catch {
    /* fullscreen qo'llab-quvvatlanmasa — jim o'tamiz */
  }
}

export async function closeWindow(): Promise<void> {
  const e = electron()
  if (e?.close) return e.close()
  if (!isTauri()) return
  const { getCurrentWindow } = await import('@tauri-apps/api/window')
  await getCurrentWindow().close()
}
