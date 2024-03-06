// Загрузка данных из хранилища
chrome.storage.local.get(null, function (items){
    for (var key in items){
        // Поиск опорного элемента <div></div> по Id
        var myTableDiv = document.getElementById("dynamicTable");
        // Создаем таблицу с классом 
        var table = document.createElement('TABLE');
        table.className = "table_main";
        // Создаем тело таблицы
        var tableBody = document.createElement('TBODY');
        tableBody.className = "table_tr";
        table.appendChild(tableBody);
        // Заполняем ячейку "домен"
        var tr = document.createElement('TR');
        tr.className = "content_left";
        tr.appendChild(document.createTextNode(key));
        tableBody.appendChild(tr);
        // Заполняем ячейку "инъекция" 
        var td = document.createElement('TR');
        td.className = "content_right";
        td.appendChild(document.createTextNode(items[key]));
        tableBody.appendChild(td);
        // Добавляем созданную таблицу
        myTableDiv.appendChild(table);
    }
});
// Изменение активных кнопок
if(localStorage.warnmode == "active"){
    document.getElementById('warn-mode').classList.add('active');
    document.getElementById('block-mode').classList.remove('active');
}
else{ 
    document.getElementById('warn-mode').classList.remove('active');
    document.getElementById('block-mode').classList.add('active');
}
// Обработка изменения режима
document.getElementById('warn-mode').addEventListener("click",() => {
    localStorage.warnmode = 'active';
    alert('НЕ РЕКОМЕНДУЕТСЯ использовать режим "Подтверждение". ' +
    'Вам необходимо будет подтверждать переход по опасной ссылке каждый раз, используйте этот режим только при подозрении на ошибочную блокировку URL.');
    document.getElementById('warn-mode').classList.add('active');
    document.getElementById('block-mode').classList.remove('active');
});
document.getElementById('block-mode').addEventListener("click",() => {
    localStorage.warnmode = 'deactive';
    document.getElementById('warn-mode').classList.remove('active');
    document.getElementById('block-mode').classList.add('active');
});




