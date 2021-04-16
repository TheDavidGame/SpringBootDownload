
// код модального окна
(function () {
    if (typeof window.CustomEvent === "function") return false;
    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: null };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }
    window.CustomEvent = CustomEvent;
})();

$modal = function (options) {
    var
        _elemModal,
        _eventShowModal,
        _eventHideModal,
        _hiding = false,
        _destroyed = false,
        _animationSpeed = 200;

    function _createModal(options) {
        var
            elemModal = document.createElement('div'),
            modalTemplate = '<div class="modal__backdrop" data-dismiss="modal"><div class="modal__content"><div class="modal__header"><div class="modal__title" data-modal="title">{{title}}</div><span class="modal__btn-close" data-dismiss="modal" title="Закрыть">×</span></div><div class="modal__body" data-modal="content">{{content}}</div>{{footer}}</div></div>',
            modalFooterTemplate = '<div class="modal__footer">{{buttons}}</div>',
            modalButtonTemplate = '<button type="button" class="{{button_class}}" data-handler={{button_handler}}>{{button_text}}</button>',
            modalHTML,
            modalFooterHTML = '';

        elemModal.classList.add('modal');
        modalHTML = modalTemplate.replace('{{title}}', options.title || 'Новое окно');
        modalHTML = modalHTML.replace('{{content}}', options.content || '');
        if (options.footerButtons) {
            for (var i = 0, length = options.footerButtons.length; i < length; i++) {
                var modalFooterButton = modalButtonTemplate.replace('{{button_class}}', options.footerButtons[i].class);
                modalFooterButton = modalFooterButton.replace('{{button_handler}}', options.footerButtons[i].handler);
                modalFooterButton = modalFooterButton.replace('{{button_text}}', options.footerButtons[i].text);
                modalFooterHTML += modalFooterButton;
            }
            modalFooterHTML = modalFooterTemplate.replace('{{buttons}}', modalFooterHTML);
        }
        modalHTML = modalHTML.replace('{{footer}}', modalFooterHTML);
        elemModal.innerHTML = modalHTML;
        document.body.appendChild(elemModal);
        return elemModal;
    }

    function _showModal() { 
        if (!_destroyed && !_hiding) {
            _elemModal.classList.add('modal__show');
            document.dispatchEvent(_eventShowModal);
        }
    }

    function _hideModal() {
        _hiding = true;
        _elemModal.classList.remove('modal__show');
        _elemModal.classList.add('modal__hiding');
        setTimeout(function () {
            _elemModal.classList.remove('modal__hiding');
            _hiding = false;
        }, _animationSpeed);
        document.dispatchEvent(_eventHideModal);
    }

    function _handlerCloseModal(e) {
        if (e.target.dataset.dismiss === 'modal') {
            _hideModal();
        }
    }

    _elemModal = _createModal(options || {});


    _elemModal.addEventListener('click', _handlerCloseModal);
    _eventShowModal = new CustomEvent('show.modal', { detail: _elemModal });
    _eventHideModal = new CustomEvent('hide.modal', { detail: _elemModal });

    return {
        show: _showModal,
        hide: _hideModal,
        destroy: function () {
            _elemModal.parentElement.removeChild(_elemModal),
                _elemModal.removeEventListener('click', _handlerCloseModal),
                _destroyed = true;
        },
        setContent: function (html) {
            _elemModal.querySelector('[data-modal="content"]').innerHTML = html;
        },
        setTitle: function (text) {
            _elemModal.querySelector('[data-modal="title"]').innerHTML = text;
        }
    }
};




var modal = $modal({ // структура модального окна
    title: 'Добавить поле в форму',
    content: '<form> <label>Название</label><br> <input type="text" id = "input1"><br> <label>Тип</label><br> <select> <option>text</option> <option>email</option> <option>tel</option> <option>password</option> <option>date</option> </select> </form>',

    footerButtons: [
      {id: 'model_save', class: 'btn btn__ok', text: 'Сохранить', handler: 'modalHandlerSave' }
    ]
  });
  
document.querySelector('#show-modal').addEventListener('click',function(e){//открыть окно при нажатии на кнопку "Добавить"
     modal.show();
  });

let fields = []; //глобальный массив
// [{id:1,type:"string",name:"Имя"},
// {id:2,type:"string",name:"Фамилия"}]; 


start();
document.addEventListener('click', function (e) {
    if (e.target.dataset.handler === 'modalHandlerSave') {
       let elem = document.getElementById('input1'); 
       let field_name = elem.value ; //значение поля
       let field_type = document.getElementsByTagName("select")[0].value;// тип поля 
       let table = document.getElementById("tableID"); //таблица
       elem.value = " ";
        let arr = {
            id:fields.length + 1,
            type:field_type,
            name:field_name,
        }
        fields.push(arr);
       refresh(); //функция обновления после добавления строки
       modal.hide(); // закрытие модального окна
    }
  });


function start(){ //начальная пустая таблица
    let table = document.createElement('table');
    table.id = "tableID";
    let tbody = document.createElement('tbody');
    let tr = document.createElement('tr');
            tr.innerHTML = '<td>Название</td><td>Тип</td><td>Действие</td>';
            tbody.appendChild(tr);

            for(let i = 0;i < 2;i++){
                let tr = document.createElement('tr');
            
                for (let j = 0; j < 3 ; j++) {
                    let td = document.createElement('td');
                    td.innerHTML = " ";
                    tr.appendChild(td);
            
                 }
                 tbody.appendChild(tr);
                
               }
                   
               table.appendChild(tbody);
               document.getElementById('tabl').appendChild(table);
    
}

function refresh(){ // функция обновления
    let table1 = document.getElementById("tableID"); //таблица
    if(table1){
        table1.remove();
    }
   let rows = fields.length;
   let table = document.createElement('table');
   table.id = "tableID";

   let tbody = document.createElement('tbody');
   tbody.id = "tbodyID";
        let tr = document.createElement('tr');
            tr.innerHTML = '<td>Название</td><td>Тип</td><td>Действие</td>';
            tbody.appendChild(tr);

   let items = ['name','type'];
   if(rows >= 6){
       rows = 6;
   }
   for(let i = 0;i < rows;i++){
    let tr = document.createElement('tr');

    for (let j = 0; j < 2 ; j++) {
        let td = document.createElement('td');
        let item = fields[i][items[j]];
        td.innerHTML = item;
        tr.appendChild(td);

     }
     tbody.appendChild(tr);

     let td = document.createElement('td');

        let field_button1 = document.createElement("input");
        field_button1.type = "button";
        field_button1.id = 'del_btn';
        field_button1.value = "-";
        field_button1.className = "button-table";
        field_button1.onclick = function(e){
            fields.splice(i, 1);  //позиция и сколько удалить 
            refresh();
        };
    
        let field_button2 = document.createElement("input");
        field_button2.type = "button";
        field_button2.id = 'up_btn';
        field_button2.value = "up";
        field_button2.className = "button-table";
        field_button2.onclick = function(e){
            if(!(0 == i)){
            fields[i] = [fields[i - 1], fields[i - 1] = fields[i]][0];
            refresh(); 
            }
        };
        
        let field_button3 = document.createElement("input");
        field_button3.type = "button";
        field_button3.id = 'down_btn';
        field_button3.value = "down";
        field_button3.className = "button-table";
        field_button3.onclick = function(e){
            if(!((fields.length - 1) == i)){
            fields[i] = [fields[i + 1], fields[i + 1] = fields[i]][0];
            refresh(); 
        }
        };
     
     td.appendChild(field_button1);
     td.appendChild(field_button2);
     td.appendChild(field_button3);
     
     tr.appendChild(td);
   }

       
   table.appendChild(tbody);
   document.getElementById('tabl').appendChild(table);
}



document.querySelector('#createform').addEventListener('click',function(e){

    let f1 = document.getElementById("formID"); //форма
    if(f1){
        f1.remove();
    }


let f = document.createElement("form");
f.id = "formID";

document.getElementById('formhtml').appendChild(f);
// document.getElementById('formhtml').hidden = true; //не показывать форму

f.insertAdjacentHTML('beforeEnd', '<div>Готовая форма</div><br>');
    for(let i = 0;i < fields.length ;i++){

        let inpt = document.createElement("input");
        inpt.type = fields[i].type;

        if(inpt.type === "text"){
            inpt.size = "20";
            inpt.className = "field text";
            inpt.id = "text";
        }
        if(inpt.type === "tel"){
            inpt.size = "20";
            inpt.className = "field tel";
            inpt.id = "phone";
        }
        if(inpt.type === "email"){
            inpt.className = "field email";
            inpt.id = "email";
        }
        if(inpt.type === "password"){

        }
        if(inpt.type === "date"){
        }
        inpt.style.marginTop = "10px";
        inpt.style.display ="block";
        inpt.style.marginLeft = "32.5%";
        inpt.placeholder = fields[i].name;

        f.appendChild(inpt);

    }
    //конец цикла
    let btn_form = document.createElement('button');
    btn_form.innerHTML = "Отправить";
    btn_form.id = "validbtn";

    f.appendChild(btn_form);

    let htmlTagsStart = '<!DOCTYPE html>\n<html>\n<head>\n' +
        '    <meta charset="UTF-8">\n' +
        '    <title>Готовая форма</title>\n' +
        '    <link rel="stylesheet" href="CSS&JavaScript/style.css">' +
        '</head>\n<body>\n' +
        '    <div class="login">\n';
    let htmlTagsEnd = '\n<script src="CSS&JavaScript/valid.js"></script>\n</div>\n</body>\n</html>';

    let formhtml = document.getElementById('formhtml');
    let text = formhtml.outerHTML;
    let filename = "form.html";
    downloadForm(filename, text);
    document.location.href = 'download';

function downloadForm(filename, text){
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/html,' + encodeURI(htmlTagsStart) + encodeURIComponent(text) + encodeURI(htmlTagsEnd));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
});