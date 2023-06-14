import ColorTable from './ColorTable.js';

export default class ColorPickerModal extends ColorTable {
    constructor() {
        super();
        this.state = {
            colorName: '',
            colorType: '',
            colorCode: '',
            index: null,
            stateOfComponent: null,
        };
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() { // Отрисовка модального окна
        const template = document.createElement('template');
        template.innerHTML = `
<style>
  @font-face {
    font-family: 'Lato';
    src: url('../fonts/Lato-Regular.ttf') format('ttf');
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: 'Lato';
    src: url('../fonts/Lato-Bold.ttf') format('ttf');
    font-weight: 700;
    font-style: normal;
  }
  .modal {
    border-radius: 20px;
    position: fixed;
    padding: 15px;
    z-index: 1;
    left: 300px;
    top: 0;
    width: 320px;
    overflow: auto;
    background-color: #313131;
    box-sizing: border-box;
    color: white;
    font-family: 'Lato';
  }

  .modal-content {
    background-color: #313131;
    border-radius: 8px;
    box-shadow: 0 2px 4px #0000001A;
  }

  .modal-title {
  text-align: center;
  margin-bottom: 27px;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  }

  .form-group {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
  }

  .form-group label {
    display: block;
    margin-right: 10px;
    width: 120px;
    font-size: 12px;
    color: #A0A0A0;
  }

  .form-group input[type="text"],
  .form-group input[type="color"],
  .form-group select {
    flex: 1;
    border-radius: 4px;
    height: 40px;
    border: 1px solid #777777;
    box-sizing: border-box;
    background-color: #777777;
    color: #A0A0A0;
  }

  .button-wrapper {
    text-align: center;
  }

  .button-wrapper button {
    background-color: #53CBF1;
    border-radius: 100px;
    width: 256px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #53CBF1;
    margin: 0 auto;
  }
</style>

<div class="modal">
  <div class="modal-content">
    <div class="modal-title">Добавление цвета</div>
    <div class="form-group">
      <label for="colorName">Название цвета</label>
      <input type="text" id="colorName" placeholder="Введите название"/>
    </div>
    <div class="form-group">
      <label for="colorType">Выберите тип</label>
      <select id="colorType">
        <option value="Main">Main</option>
        <option value="Primary">Primary</option>
        <option value="Main">Secondary</option>
        <option value="Primary">Base</option>
      </select>
      <div class="arrow"></div>
    </div>
    <div class="form-group">
      <label for="colorPicker">Выберите цвет</label>
        <input type="text" id="hex">
        <input type="color" id="color">
      <div id="colorPicker"></div>
    </div>
    <div class="button-wrapper">
      <button id="addButton">Добавить</button>
    </div>
  </div>
</div>

    `;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    setupEventListeners() { // Добавление слушателей событий для кнопок
        let colorInput = this.shadowRoot.querySelector('#color');
        let hexInput = this.shadowRoot.querySelector('#hex');

        colorInput.addEventListener('input', () => {
            hexInput.value = colorInput.value;
        });

        const addButton = this.shadowRoot.querySelector('#addButton');
        const colorNameInput = this.shadowRoot.querySelector('#colorName');
        const colorTypeElement = this.shadowRoot.querySelector('#colorType');
        const colorPickerInput = this.shadowRoot.querySelector('#hex');

        if (this.state.stateOfComponent === 'editing') {
            colorNameInput.value = this.state.colorName;
            colorTypeElement.value = this.state.colorType;
            colorPickerInput.value = this.state.colorCode;
        }

        addButton.addEventListener('click', () => {
            this.state.colorName = colorNameInput.value;
            this.state.colorType = colorTypeElement.value;
            this.state.colorCode = colorPickerInput.value;

            // Создаем объект цвета и сохраняем его
            const colorObject = {
                colorName: this.state.colorName,
                type: this.state.colorType,
                code: this.state.colorCode
            };

            const colorTable = document.querySelector('modal-window');
            if (this.state.stateOfComponent === 'editing') {
                colorTable.editColor(colorObject, this.state.index);
            } else {
                colorTable.setNewColor(colorObject);
            }

            colorNameInput.value = '';
            colorTypeElement[0].checked = true;
            colorPickerInput.value = '';
            this.state.stateOfComponent = null;

            const colorPickerModal = document.querySelector('color-modal');
            colorPickerModal.style.display = 'none';
        });
    }

    setColors(color, index, state) { // Метод через, который перебрасываются данные из компонента ColorTable
        this.state.colorName = color.colorName;
        this.state.colorType = color.type;
        this.state.colorCode = color.code;
        this.state.index = index;
        this.state.stateOfComponent = state;
    }

}

