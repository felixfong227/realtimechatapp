var fileInput = document.querySelector('#fileUpload');
var fileProgress = document.querySelector('#fileProgress');
var fileMsg = document.querySelector('#fileMsg');
// If the change the content of the file input
fileInput.addEventListener('change', function(e){
    var file = e.target.files[0];
    var formDate = new FormData();
    formDate.append('file', file);
    var ajax = new XMLHttpRequest();
    ajax.open('POST', '/api/file/upload');
    ajax.send(formDate);

    ajax.upload.addEventListener('progress', e => {
        var progress = (e.loaded / e.total) * 100;
        fileProgress.value = progress;
    }, false);

    ajax.onload = function(){
        if(ajax.status === 200 && ajax.readyState === 4){
            var response = JSON.parse(ajax.response);
            if(response.error === true){
                var response = JSON.parse(ajax.response);
                fileMsg.innerHTML = response.msg;    
            }else{
                inputBox.value += '!['+file.name+'](' + response.image.url + ')';
                e.target.value = null;
            }
        }
    }
});