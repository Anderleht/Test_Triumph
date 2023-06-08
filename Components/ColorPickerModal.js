export default class ColorPickerModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.colorName = '';
        this.colorType = '';
        this.colorCode = '';
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
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
    display: block;
    position: fixed;
    padding: 15px;
    z-index: 1;
    left: 0;
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
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  .form-group select option {
  position: absolute;
  top: 100%;
  left: 0;
}

  .button-wrapper {
    text-align: center;
  }

  .button-wrapper button {
    background-color: rgba(83, 203, 241, 1);
    border-radius: 100px;
    width: 256px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(83, 203, 241, 1);
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
        <option value="Тип 1">Тип 1</option>
        <option value="Тип 2">Тип 2</option>
      </select>
      <div class="arrow"></div>
    </div>
    <div class="form-group">
      <label for="colorPicker">Выберите цвет</label>
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

    setupEventListeners() {
        const modal = this.shadowRoot.querySelector('.modal');
        const closeButton = this.shadowRoot.querySelector('.close-button');
        const addButton = this.shadowRoot.querySelector('#addButton');
        const colorNameInput = this.shadowRoot.querySelector('#colorName');
        const colorTypeInputs = this.shadowRoot.querySelectorAll('[name="colorType"]');
        const colorPickerInput = this.shadowRoot.querySelector('#colorPicker');

        // При нажатии на кнопку "Добавить"
        addButton.addEventListener('click', () => {
            this.colorName = colorNameInput.value;
            this.colorType = [...colorTypeInputs].find(input => input.checked).value;
            this.colorCode = colorPickerInput.value;

            // Создаем объект цвета и сохраняем его
            const colorObject = {
                colorName: this.colorName,
                colorType: this.colorType,
                colorCode: this.colorCode
            };

            // Вызываем пользовательское событие для передачи данных обратно во внешний код
            this.dispatchEvent(new CustomEvent('colorAdded', { detail: colorObject }));

            // Сбрасываем значения полей
            colorNameInput.value = '';
            colorTypeInputs[0].checked = true;
            colorPickerInput.value = '';
        });
    }
}

customElements.define('color-modal', ColorPickerModal);
