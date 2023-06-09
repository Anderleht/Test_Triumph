export default class ColorTable extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.state = { // Хранилище цветов
            colors: [],
        }
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.loadData();
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


  .content {
    width: 679px;
    color: #ffffff;
    background-color: #313131;
    border-radius: 20px;
    align-items: center;
    justify-content: center;
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 400;
    box-sizing: border-box;
    margin: 0;
    border: 1px solid #000000;
  }

  .header {
    align-items: center;
    justify-content: space-between;
    display: flex;
    height: 67px;
  }

  .close-button {
    padding-left: 10px;
    cursor: pointer;
    border: none;
    background: none;
    font-size: 18px;
  }
  .save-button {
    margin-left: auto;
    padding: 0;
    cursor: pointer;
    border: none;
    background: none;
    font-size: 18px;
  }

  .header h2 {
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 18px;
    margin-top: 20px;
    line-height: 50px;
    height: 22px;
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
    line-height: 15px;
    font-weight: 400;
    word-break: break-word;
  }
  
  .color-table th,
  .color-table td {
    border-bottom: 1px solid #313131;
    border-right: 1px solid #313131;
    height: 54px;
    width: 16.66%;
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
    margin: 30px 244px 32px auto;
    width: fit-content;
    overflow: hidden;
    border-radius: 100px;
    padding: 9px 67px;
    border: 1px solid #53CBF1;
    background-color: #313131;
    color: #ffffff;
  }
  .color-square {
    width: 41px;
    height: 41px;
    margin: 0 auto;
  }
    .color-table-body tr.dragged {
    background-color: #545454;
  }

  .color-table-body tr.over {
    background-color: #717171;
  }
  .edit-button {
    padding: 0;
    border: none;
    background-position: center;
    background-repeat: no-repeat;
    background-color: #424242;
    width: 90%;
    height: 90%;
    background-image: url("../icons/change.png");
  }
  .delete-button {
    padding: 0;
    border: none;
    background-position: center;
    background-repeat: no-repeat;
    background-color: #424242;
    width: 90%;
    height: 90%;
    background-image: url("../icons/delete.png");
  }
  
  .edit-button:hover {
    background-image: url("../icons/change-active.png");
  }
  .delete-button:hover {
    background-image: url("../icons/delete-active.png");
  }
</style>

<div class="content">
  <div class="header">
    <h2 class="color-table-name">Таблица цветов</h2>
    <button class="save-button"><img src="../icons/save.png" alt="Кнопка сохранить"></button>
    <button class="close-button"><img src="../icons/close_icon.png" alt="Кнопка закрыть"></button>
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

    updateTable() {  // Отрисовка и обновление таблицы цветов
        const tbody = this.shadowRoot.querySelector('.color-table-body');

        const getNextElement = (y, currentElement) => {
            const currentElementRect = currentElement.getBoundingClientRect();
            const offset = y - currentElementRect.top;
            const nextElement =
                offset > currentElementRect.height / 2
                    ? currentElement.nextElementSibling
                    : currentElement;

            return nextElement;
        }

        const getPreviousElement = (y, currentElement) => {
            const currentElementRect = currentElement.getBoundingClientRect();
            const offset = y - currentElementRect.top;
            const previousElement =
                offset < currentElementRect.height / 2
                    ? currentElement.previousElementSibling
                    : currentElement;

            return previousElement;
        };


        tbody.addEventListener('dragstart', (evt) => { // Часть отвечающая за возможность переноса строк таблицы.
            evt.target.classList.add('selected');
            evt.dataTransfer.setData('text/plain', ''); // Требуется для перетаскивания в Firefox
        });

        tbody.addEventListener('dragend', (evt) => {
            evt.target.classList.remove('selected');
        });

        tbody.addEventListener('dragover', (evt) => {
            evt.preventDefault();
            const draggedElement = tbody.querySelector('.selected');
            const currentElement = evt.target.closest('.color-table-row', this.shadowRoot);

            if (draggedElement === currentElement) {
                return;
            }

            const nextElement = getNextElement(evt.clientY, currentElement);
            const previousElement = getPreviousElement(evt.clientY, currentElement);

            if (
                nextElement && draggedElement === nextElement.previousElementSibling ||
                previousElement && draggedElement === previousElement.nextElementSibling
            ) {
                return;
            }

            const draggedIndex = parseInt(draggedElement.dataset.index);
            const newIndex = nextElement ? parseInt(nextElement.dataset.index) : this.state.colors.length - 1;

            const [movedColor] = this.state.colors.splice(draggedIndex, 1);
            this.state.colors.splice(newIndex, 0, movedColor);
            this.updateTable();
        });

        tbody.innerHTML = '';

        this.state.colors.forEach((color, index) => { //  Отрисовка строк таблицы из хранилища цветов
            const row = document.createElement('tr');
            row.classList.add('color-table-row');
            row.draggable = true;
            row.dataset.index = index;
            row.innerHTML = `
        <td>
          <div class="color-square" style="background-color: ${color.code};"></div>
        </td>
        <td>${color.colorName}</td>
        <td>${color.type}</td>
        <td>${color.code}</td>
        <td><button class="edit-button" data-index="${index}"></button></td>
        <td><button class="delete-button" data-index="${index}"></button></td>
      `;
            tbody.appendChild(row);
            const editButton = row.querySelector('.edit-button');
            const deleteButton = row.querySelector('.delete-button');

            // Добавление обработчика события на кнопку редактирования
            editButton.addEventListener('click', (evt) => {
                const index = parseInt(evt.target.dataset.index);
                const color = this.state.colors[index];
                this.openColorPickerModalEdit(color, index);

            });
            // Добавление обработчика события на кнопку удаления
            deleteButton.addEventListener('click', (evt) => {
                const index = parseInt(evt.target.dataset.index);
                this.deleteColor(index);
            });
        });
    }

    setupEventListeners() { // Добавление слушателей событий для кнопок
        const addButton = this.shadowRoot.querySelector('.add-color-button');
        addButton.addEventListener('click', () => {
            this.openColorPickerModal();
        });

        const closeButton = this.shadowRoot.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            this.close();
        });

        const saveButton = this.shadowRoot.querySelector('.save-button');
        saveButton.addEventListener('click', () => {
            this.saveData();
        });
    }

    // Методы для работы с модальным окном

    open() {
        this.style.display = 'block';
    }

    close() {
        this.style.display = 'none';
    }

    deleteColor(index) {
        this.state.colors.splice(index, 1);
        this.updateTable();
    }

    saveData() {
        const data = JSON.stringify(this.state.colors);
        localStorage.setItem('colorTableData', data);
    }

    loadData() {
        const data = localStorage.getItem('colorTableData');
        if (data) {
            this.state.colors = JSON.parse(data);
            this.updateTable();
        }
    }

    setNewColor(newColor) { // Метод через, который перебрасываются данные из компонента ColorPickerModal
        this.state.colors.push(newColor);
        this.updateTable();
    }

    editColor(color, index) {
        this.state.colors[index] = {
            colorName: color.colorName,
            type: color.type,
            code: color.code
        };
        this.updateTable();
    }

    openColorPickerModal() {
        const colorPickerModal = document.querySelector('color-modal');
        colorPickerModal.style.display = 'block';
        colorPickerModal.state.stateOfComponent = 'adding';
    }

    openColorPickerModalEdit(currentColor, index) {
        const colorPickerModal = document.querySelector('color-modal');
        colorPickerModal.style.display = 'block';
        colorPickerModal.setColors(currentColor, index, 'editing');
    }
}