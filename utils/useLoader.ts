import { modals } from '@mantine/modals';

export function showGlobalLoader(message?: string) {
  modals.openContextModal({
    modal: 'loader',
    centered: true,
    withCloseButton: false,
    closeOnClickOutside: false,
    closeOnEscape: false,
    size: 'auto', // allow natural sizing
    classNames: {
      body: 'loader-modal-body',
      content: 'loader-modal-content',
    },
    styles: {
      body: { padding: 0, margin: 0 },
      content: {
        width: 150,
        height: 120,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
    overlayProps: {
      opacity: 0.3,
      blur: 4,
    },
    innerProps: {
      message: message || 'Loading...',
    },
  });
}

export function hideGlobalLoader() {
  modals.closeAll();
}
