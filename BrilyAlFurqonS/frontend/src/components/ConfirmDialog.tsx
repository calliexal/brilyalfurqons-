export async function confirmDialog(title: string, message: string, options?: { confirmText?: string; confirmClass?: string }): Promise<boolean> {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 px-4';

    const dialog = document.createElement('div');
    dialog.className = 'w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl';

    const confirmText = options?.confirmText ?? 'Delete';
    const confirmClass = options?.confirmClass ?? 'bg-red-600 hover:bg-red-700';

    dialog.innerHTML = `
      <h3 class="text-lg font-semibold text-slate-900">${title}</h3>
      <p class="mt-3 text-sm leading-6 text-slate-600">${message}</p>
      <div class="mt-6 flex justify-end gap-3">
        <button type="button" class="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" data-action="cancel">Cancel</button>
        <button type="button" class="rounded-2xl px-4 py-2 text-sm font-medium text-white ${confirmClass}" data-action="confirm">${confirmText}</button>
      </div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    const cleanup = () => {
      overlay.remove();
    };

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        cleanup();
        resolve(false);
      }
    });

    dialog.querySelector('[data-action="cancel"]')?.addEventListener('click', () => {
      cleanup();
      resolve(false);
    });

    dialog.querySelector('[data-action="confirm"]')?.addEventListener('click', () => {
      cleanup();
      resolve(true);
    });
  });
}
