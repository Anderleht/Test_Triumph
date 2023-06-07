class ModalWindow extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isOpen = true;
        this.colors = [
            { colorName: 'Мятное утро', type: 'Основной', code: '#86EAE9' },
            { colorName: 'Лавандовый пунш', type: 'Основной', code: '#AAFEA9' },
            { colorName: 'Лавандовый пунш', type: 'Основной', code: '#AFEABF' },
        ];
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
    src: url('fonts/Lato-Regular.ttf') format('ttf');
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: 'Lato';
    src: url('fonts/Lato-Bold.ttf') format('ttf');
    font-weight: 700;
    font-style: normal;
  }

  img {
    max-width: 100%;
    display: block;
  }

  .modal-content {
    width: 679px;
    color: #ffffff;
    background-color: #313131;
    border-radius: 20px;
    align-items: center;
    justify-content: center;
    font-family: 'Lato';
    font-weight: 600;
    box-sizing: border-box;
    margin: 10% auto;
    border: 1px solid #000000;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 10px;
    padding-left: 10px;
  }

  .save-button,
  .close-button {
    cursor: pointer;
    border: none;
    background: none;
    font-size: 18px;
    margin-left: auto;
  }

  .modal-header h2 {
    flex-grow: 1;
    text-align: center;
    font-weight: 600;
    padding-bottom: 25px;
    font-size: 18px;
    margin-top: 20px;
    line-height: 50px;
    height: 22px;
  }

  .save-button {
    margin-right: 4px;
  }

  .color-table {
    width: 100%;
    background-color: #424242;
    border-collapse: collapse;
  }

  .color-table td {
    padding: 0;
    text-align: center;
    font-size: 11px;
    font-weight: 400;
    word-break: break-word;
  }

  .color-table td .close-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border: none;
    background: none;
    font-size: 18px;
    padding: 0;
  }

  .color-table td .edit-button,
  .color-table td .delete-button {
    width: 115px;
    height: 55px;
    margin: 0;
    padding: 0;
  }

  .color-table th,
  .color-table td {
    border-bottom: 1px solid #313131;
    border-right: 1px solid #313131;
    height: 54px;
    width: 115px;
  }

  .color-table-body {
    color: #bfbfbf;
  }

  .color-table td:last-child,
  .color-table th:last-child {
    border-right: none;
  }

  .add-color-button {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    margin-right: auto;
    width: fit-content;
    margin-top: 30px;
    margin-bottom: 32px;
    overflow: hidden;
    border-radius: 100px;
    padding: 9px 67px;
    border: 1px solid rgba(83, 203, 241, 1);
    background-color: #313131;
    color: #ffffff;
  }
  .color-square {
    width: 41px;
    height: 41px;
    margin: 0 auto;
  }

  .edit-button {}
</style>

<div class="modal-content">
  <div class="modal-header">
    <h2 class="color-table-name">Таблица цветов</h2>
    <button class="save-button"><img src="icons/Vector.png" alt="Кнопка сохранить"></button>
    <button class="close-button"><img src="icons/close_icon.png" alt="Кнопка закрыть"></button>
  </div>
  <table class="color-table">
    <thead>
      <tr>
        <th>Цвет</th>
        <th>Название</th>
        <th>Тип</th>
        <th>Код</th>
        <th>Изменить</th>
        <th>Удалить</th>
      </tr>
    </thead>
    <tbody class="color-table-body"></tbody>
  </table>
  <button class="add-color-button">Добавить цвет</button>
</div>
        `;
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.updateTable();
    }

    updateTable() {
        const tbody = this.shadowRoot.querySelector('tbody');
        tbody.innerHTML = '';
        this.colors.forEach((color, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
      <td>
        <div class="color-square" style="background-color: ${color.code};"></div>
      </td>
      <td>${color.colorName}</td>
      <td>${color.type}</td>
      <td>${color.code}</td>
      <td><button class="edit-button" data-index="${index}"><img src="icons/change.png" alt="Кнопка изменить"></button></td>
      <td><button class="delete-button" data-index="${index}"><img src="icons/delete.png" alt="Кнопка удалить"></button></td>
    `;
            tbody.appendChild(row);
        });
    }

    setupEventListeners() {
        const openModalButton = document.getElementById('openModal');
        openModalButton.addEventListener('click', () => {
            this.open();
        });

        const closeButton = this.shadowRoot.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            this.close();
        });

        const addButton = this.shadowRoot.querySelector('.add-color-button');
        addButton.addEventListener('click', () => {
            this.addColor();
        });

        const editButtons = this.shadowRoot.querySelectorAll('.edit-button');
        editButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const index = parseInt(event.target.dataset.index);
                this.editColor(index);
            });
        });

        const deleteButtons = this.shadowRoot.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const index = parseInt(event.target.dataset.index);
                this.deleteColor(index);
            });
        });
    }

    open() {
        this.isOpen = true;
        this.style.display = 'block';
    }

    close() {
        this.isOpen = false;
        this.style.display = 'none';
    }

    addColor() {
        const name = prompt('Введите название цвета:');
        const colorName = prompt('Введите название цвета:');
        const type = prompt('Введите тип цвета:');
        const code = prompt('Введите код цвета:');

        if (name && colorName && type && code) {
            const newColor = { name, colorName, type, code };
            this.colors.push(newColor);
            this.updateTable();
        }
    }

    editColor(index) {
        const color = this.colors[index];
        const newName = prompt('Введите новое название цвета:', color.name);
        const newColorName = prompt('Введите новое название цвета:', color.colorName);
        const newType = prompt('Введите новый тип цвета:', color.type);
        const newCode = prompt('Введите новый код цвета:', color.code);

        if (newName && newColorName && newType && newCode) {
            color.name = newName;
            color.colorName = newColorName;
            color.type = newType;
            color.code = newCode;
            this.updateTable();
        }
    }

    deleteColor(index) {
        this.colors.splice(index, 1);
        this.updateTable();
    }
}

customElements.define('modal-window', ModalWindow);

const openModalButton = document.getElementById('openModal');
const modal = document.querySelector('modal-window');

openModalButton.addEventListener('click', () => {
    modal.open();
});