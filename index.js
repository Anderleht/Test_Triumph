import ColorTable from './Components/ColorTable.js'
import ColorPickerModal from "./Components/ColorPickerModal.js";

customElements.define('modal-window', ColorTable);

customElements.define('color-modal', ColorPickerModal);

const colorTable = document.createElement('modal-window');
const colorPickerModal = document.createElement('color-modal');
colorPickerModal.style.display = 'none';
document.body.appendChild(colorPickerModal);
document.body.appendChild(colorTable);
