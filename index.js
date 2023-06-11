import ColorTable from './Components/ColorTable.js'
import ColorPickerModal from "./Components/ColorPickerModal.js";

customElements.define('modal-window', ColorTable);

customElements.define('color-modal', ColorPickerModal);

const colorPickerModal = document.querySelector('color-modal');
colorPickerModal.style.display = 'none';
