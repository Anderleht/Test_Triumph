import ColorTable from './Components/ColorTable.js'
import ColorPickerModal from "./Components/ColorPickerModal.js";

customElements.define('modal-window', ColorTable);

const openModalButton = document.getElementById('openModal');
const modal = document.querySelector('modal-window');
customElements.define('color-modal', ColorPickerModal);

openModalButton.addEventListener('click', () => {
    modal.open();
});