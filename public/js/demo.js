const actionType = {
    "修改": "modify",
    "刪除": "delete",
    "新增": "add",
}


$(document).ready(function () {
    fetchData("get_all");
    bindingEventListener();

    $('[data-toggle="tooltip"]').tooltip();
    $("[data-toggle='popover']").popover();
    
});

function bindingEventListener(){
    // 修改鈕
    $("#cardtable").on('click', '.modifybutton', function () {
        var ajaxobj = new AjaxObject(url, 'json');
        ajaxobj.modify_get();
    })
    $("#cardtable").on('click', '.deletebutton', function () {
        var deleteid = $(this).attr('id').substring(12);
        var url = "ajax/ajaxCard";
        var ajaxobj = new AjaxObject(url, 'json');
        ajaxobj.id = deleteid;
        ajaxobj.delete();
    })

    $("#dialog-addconfirm").on('change', "#cnname", function(e) {
        if(e.target.value.length > 0){
            $("#errorMessageCnName").remove();
        }
    })

    $("#dialog-addconfirm").on('change', "#phoneNumber", function(e) {
        phoneNumberValidation(e.target.value);
    })

    $("#dialog-addconfirm").on('change', "#email", function(e) {
        emailValidation(e.target.value);
    })

    $("#cardtable").on('mouseover', 'tbody tr', function (e) {
        mouseActionDetect(e, "add");  
    })

    $("#cardtable").on('mouseout', 'tbody tr', function (e) {
        mouseActionDetect(e, "remove");
    })

    $('#confirmModal').on('show.bs.modal', function (e) {
        let btn = $(e.relatedTarget);
        let title = btn.data('title') || btn[0].innerText;
        let modal = $(this);
        modal.find('.modal-title').text(title);
        modal.find('.modal-body').text( "確定要" + title + "資料嗎？");
        modal.find('.comfirmButton').text(title); 
              
        action = actionType[title];    
    });

    $("#confirmModal").on('click', '#comfirmButton', function () { 
        handleClickAction(action)
    })
}

function phoneNumberValidation(value){
    const phoneNumberReg = /^(09)[0-9]{8}$/;
    if(value.length != 10 || !phoneNumberReg.test(value)) {
        let phoneNumberIsValid = false;
        showErrorMessage("phoneNumber");
        return phoneNumberIsValid;
    }else{
        let phoneNumberIsValid = true;
        $("#errorMessagePhone").remove();
        return phoneNumberIsValid;
    }
}

function emailValidation(value){
    const regex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
    if(!regex.test(value)) {
        let emailIsValid = false;
        showErrorMessage("email");
        return emailIsValid;
    }else{
        let emailIsValid = true;
        $("#errorMessageEmail").remove();
        return emailIsValid;
    }
}

function showErrorMessage(element){
    if(element == "email"){
        if(!$("#errorMessageEmail").length){
            $(".email").append($("<span id='errorMessageEmail'></span>").html("email格式有誤"));
        }
    }else if (element == "cnname"){
        if(!$("#errorMessageCnName").length){
            $(".formcnname").append($("<span id='errorMessageCnName'></span>").html("中文名字為必填"));
        }
    }
    else{
        if(!$("#errorMessagePhone").length){
            $(".phoneNumber").append($("<span id='errorMessagePhone'></span>").html("手機格式有誤"));
        }
    }
}

function handleClickAction(action) {
    
    switch(action){        
        case "modify":
            fetchData("modify");
            $('#confirmModal').modal('hide');
            return;
        case "delete":
            fetchData("delete");
            $('#confirmModal').modal('hide');
            return;
        case "add":
            let phoneNumberIsValid = phoneNumberValidation($("#phoneNumber").val());
            let emailIsValid = emailValidation($("#email").val());
            let isCnNameFilled = $("#cnname").val().length > 0 ? true : false;
            let isSexFilled = ($("#maleRadio").prop("checked") || $("#femaleRadio").prop("checked")) ? true : false;
            if( phoneNumberIsValid && emailIsValid && isCnNameFilled && isSexFilled){
                fetchData("add");            
                $('#confirmModal').modal('hide');
            }else if( !isCnNameFilled ){
                showErrorMessage("cnname");
                $('#confirmModal').modal('hide');
            }else if( !phoneNumberIsValid ){
                showErrorMessage("phoneNumber");
                $('#confirmModal').modal('hide');
            }else if( !emailIsValid ){
                showErrorMessage("email");
                $('#confirmModal').modal('hide');
            }
            
            return;
    }
    
}

function localAjax(type){
    var url = "ajax/ajaxCard";
    var ajaxobj = new AjaxObject(url, 'json');
    switch(type){
        case "get_all":
            ajaxobj.getall();
        case "modify":
            ajaxobj.modify();
            return;
        case "delete":
            ajaxobj.delete();
            return;
        case "add":
            ajaxobj.add();
            return;
    }
}

function fetchData(type){
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "/" + type);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                let response = JSON.parse(xhr.responseText).result;
                refreshTable(response);
                return;
            } else {
                localAjax(type);
            }
        } else {
            localAjax(type);
        }
    };
    xhr.send(null);
    return;
}

function mouseActionDetect(event, status){
    let className = event.target.className.split(' ');
    if (className.includes("btn")) return;
    switch(status){
        case "add":
            className.map( function(obj) {
                let targetClassname = "." + obj;
                $(targetClassname).addClass("onTarget")
            });
            return;
        case "remove":
            className.map( function(obj) {
                let targetClassname = "." + obj;
                $(targetClassname).removeClass("onTarget")
            });
            return;
    }
    return;
}

function refreshTable(data) {
    $("#cardtable tbody > tr").remove();
    $.each(data, function (key, item) {
        var strsex = '';
        var color = ''
        if (item.sex == 0){
            strsex = '男';
            color = "blue";
        }else{
            strsex = '女';
            color = "red";
        }
        var row = $("<tr></tr>");

        var nameTooltip = "[" + strsex + "]" + item.cnname + "(" + item.enname + ")";
        var phonePopover = "聯絡方式：" + item.phoneNumber.substring(0,4) + "-" + item.phoneNumber.substring(4,7) + "-" + item.phoneNumber.substring(7);
        row.append($("<td data-toggle='tooltip' data-placement='right' title='" + nameTooltip + "' class='col1 rowId"+key+"'></td>").html(item.cnname));
        row.append($("<td data-toggle='tooltip' data-placement='right' title='" + nameTooltip + "' class='col2 rowId"+key+"'></td>").html(item.enname));
        row.append($("<td class='col3 rowId"+key+"' style=color:"+ color +"></td>").html(strsex));
        row.append($("<td data-toggle='popover' title='"+ phonePopover+"' class='col4 rowId"+key+"'></td>").html(item.phoneNumber));
        row.append($("<td class='col5 rowId"+key+"'></td>").html(item.email));
        row.append($("<td class='col6 rowId"+key+"'></td>").html('<button id="modifybutton' + item.s_sn + '" type="button" class="btn btn-warning" data-toggle="modal" data-target="#confirmModal"> 修改 <span class="glyphicon glyphicon-list-alt"></span></button>'));
        row.append($("<td class='col7 rowId"+key+"'></td>").html('<button id="deletebutton' + item.s_sn + '" type="button" class="btn btn-danger" data-toggle="modal" data-target="#confirmModal"> 刪除 <span class="glyphicon glyphicon-trash"></span></button>'));
        $("#cardtable").append(row);
    });
}

function initEdit(response) {
  var modifyid = $("#cardtable").attr('id').substring(12);
  $("#mocnname").val(response[0].cnname);
  $("#moenname").val(response[0].enname);
  if (response[0].sex == 0) {
      $("#modifyman").prop("checked", true);
      $("#modifywoman").prop("checked", false);
  }
  else {
      $("#modifyman").prop("checked", false);
      $("#modifywoman").prop("checked", true);
  }
  $("#modifysid").val(modifyid);
  $("#dialog-modifyconfirm").dialog({
      resizable: true,
      height: $(window).height() * 0.4,// dialog視窗度
      width: $(window).width() * 0.4,
      modal: true,
      buttons: {
          // 自訂button名稱
          "修改": function (e) {
              // $("#modifyform").submit();
              var url = "ajax/ajaxCard";
              var cnname = $("#mocnname").val();
              var enname = $("#moenname").val();
              var sex = $('input:radio:checked[name="mosex"]').val();
              var phoneNumber = $('#phoneNumber').val();
              var email = $('#email').val();
              var ajaxobj = new AjaxObject(url, 'json');
              ajaxobj.cnname = cnname;
              ajaxobj.enname = enname;
              ajaxobj.sex = sex;
              ajaxobj.id = modifyid;
              ajaxobj.email = email;
              ajaxobj.phoneNumber = phoneNumber;
              ajaxobj.modify();

              e.preventDefault(); // avoid to execute the actual submit of the form.
          },
          "重新填寫": function () {
              $("#modifyform")[0].reset();
          },
          "取消": function () {
              $(this).dialog("close");
          }
      },
      error: function (exception) { alert('Exeption:' + exception); }
  });
}

/**
 * 
 * @param string
 *          url 呼叫controller的url
 * @param string
 *          datatype 資料傳回格式
 * @uses refreshTable 利用ajax傳回資料更新Table
 */
function AjaxObject(url, datatype) {
    this.url = url;
    this.datatype = datatype;
}
AjaxObject.prototype.email = '';
AjaxObject.prototype.phoneNumber = '';
AjaxObject.prototype.cnname = '';
AjaxObject.prototype.enname= '';
AjaxObject.prototype.sex = '';
AjaxObject.prototype.id = 0;
AjaxObject.prototype.alertt = function () {
    alert("Alert:");
}
AjaxObject.prototype.getall = function () {
  response = '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0","phoneNumber":"0900000000","email":"test00@gmail.com"},{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0","phoneNumber":"0911000000","email":"test01@gmail.com"},{"s_sn":"50","cnname":"趙雪瑜","enname":"Sharon","sex":"0","phoneNumber":"0922000000","email":"test02@gmail.com"},{"s_sn":"51","cnname":"賴佳蓉","enname":"Yoki","sex":"1","phoneNumber":"0933000000","email":"test03@gmail.com"}]';
  refreshTable(JSON.parse(response));
}
AjaxObject.prototype.add = function () {
  response = '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0","phoneNumber":"0900000000","email":"test00@gmail.com"},{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0","phoneNumber":"0911000000","email":"test01@gmail.com"},{"s_sn":"50","cnname":"趙雪瑜","enname":"Sharon","sex":"0","phoneNumber":"0922000000","email":"test02@gmail.com"},{"s_sn":"51","cnname":"賴佳蓉","enname":"Yoki","sex":"1","phoneNumber":"0933000000","email":"test03@gmail.com"},{"s_sn":"52","cnname":"新增帳號","enname":"NewAccount","sex":"1","phoneNumber":"0944000000","email":"test04@gmail.com"}]';
  refreshTable(JSON.parse(response));
}
AjaxObject.prototype.modify = function () {
  response = '[{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0","phoneNumber":"0911000000","email":"test01@gmail.com"}]';
  refreshTable(JSON.parse(response));
}
AjaxObject.prototype.modify_get = function () {
  response = '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0"},{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0"},{"s_sn":"50","cnname":"趙雪瑜","enname":"Sharon","sex":"0"},{"s_sn":"51","cnname":"賴佳蓉","enname":"Yoki","sex":"1"}]';
  initEdit(JSON.parse(response));
}
AjaxObject.prototype.search = function () {
  response = '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0"}]';
  refreshTable(JSON.parse(response));
  $("#dialog-searchconfirm").dialog("close");
}
AjaxObject.prototype.delete = function () {
  response = '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0","phoneNumber":"0900000000","email":"test00@gmail.com"},{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0","phoneNumber":"0911000000","email":"test01@gmail.com"}]';
  refreshTable(JSON.parse(response));
}