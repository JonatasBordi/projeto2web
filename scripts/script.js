$(document).ready(function () {

    // efetua a busca de estados da federação
    buscarEstados();

    // quando houver uma mudança no select de estados...
    $('#estadoAdd').change(function (event) {
        buscarCidades();
    });

    //depois daqui é o ajax de consulta
    getListOfThiefs();

    $("#btnRemover").click(function (event) {
        removeFromList();
    });

    $("#incluirCandidato").click(function (event) {
        addToList();
    }); 

});


// Função para buscar os estados
function buscarEstados() {

    var requisicaoEstados = new XMLHttpRequest();
    var tipo = 'GET';
    var assincrona = true;
    // API do IBGE - retorna arquivo JSON com todos os estados da federação
    requisicaoEstados.open(tipo, 'https://servicodados.ibge.gov.br/api/v1/localidades/estados', assincrona);
    requisicaoEstados.send()

    requisicaoEstados.onreadystatechange = function () {
        if (requisicaoEstados.readyState === XMLHttpRequest.DONE && requisicaoEstados.status === 200) {

            var obj = JSON.parse(requisicaoEstados.responseText);

            // função para ordenar os objetos por ordem alfabética
            obj.sort(function (a, b) {
                if (a.nome < b.nome) return -1;
                if (a.nome > b.nome) return 1;
                return 0;
            });

            // variável que será incremetada com <option>	
            var option;

            // laço para incrementar
            for (var i = 0; i < obj.length; i++) {
                option += '<option value="' + obj[i].id + '" id="' + obj[i].nome + '">' + obj[i].nome + '</option>';
            }

            // acrescenta em html as tags <option>
            $("#estadoAdd").html(option);

            // habilita o select cidades
            $("#estadosConsulta").removeAttr('disabled');
            $("#cidadesConsulta").removeAttr('disabled');
        }
    }
}

// Função para buscar as cidades dependendo do estado escolhido
function buscarCidades() {

    var requisicaoCidades = new XMLHttpRequest();
    var tipo = 'GET';
    var assincrona = true;
    var idEstado = $('#estadoAdd').find(':selected').attr('value');

    // API do IBGE que retorna todos os municipios relacionados com o id do estado
    requisicaoCidades.open(tipo, 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/' + idEstado + '/municipios', assincrona);
    requisicaoCidades.send();

    requisicaoCidades.onreadystatechange = function () {
        if (requisicaoCidades.readyState === XMLHttpRequest.DONE && requisicaoCidades.status === 200) {

            var obj = JSON.parse(requisicaoCidades.responseText);
            var option;

            for (var i = 0; i < obj.length; i++) {
                option += '<option value="' + obj[i].nome + '" id="' + obj[i].nome + '">' + obj[i].nome + '</option>';
            }

            // acrescenta em html as tags <option>
            $("#cidadeAdd").html(option);
        }
    }
}


function addToList() {

    var xmlreq = new XMLHttpRequest();
    var tipo = 'GET';
    var assincrona = true;
    
    var name = "nome=" + $("#nomeAdd").val();
    var sex = "&sexo=" + $("#sexoAdd").val();
    var date = "&dataNasc=" + $("#dataAdd").val();
    var street = "&rua=" + $("#ruaAdd").val();
    var number = "&numero=" + $("#numAdd").val();
    var bairro = "&bairro=" + $("#bairroAdd").val();
    var city = "&cidade=" + $("#cidadeAdd").val();
    var state = "&estado=" + $("#estadoAdd").val();
    var cpf = "&cpf=" + $("#cpfAdd").val();
    var cadjus = "&cadjus=" + $("#cadjusAdd").val();
    var email = "&email=" + $("#emailAdd").val();
    var password = "&senha=" + $("#senhaAdd").val();
    

    // Iniciar uma requisição
    xmlreq.open(tipo, "http://andrebordignon.esy.es/php/incluicandidato.php?" + name + sex + date + street + number + bairro + state + city + cpf + cadjus + email + password, true);
    xmlreq.send();
    xmlreq.onreadystatechange = function () {
        if (xmlreq.readyState == 4 && xmlreq.status == 200) {
            var resposta = xmlreq.responseText;
            
        }
    }
}


function removeFromList() {

    var xmlreq = new XMLHttpRequest();
    var tipo = 'GET';
    
    var idCandidato = "idcandidato=" + $("#txtid").val();
    
    // Iniciar uma requisição
    xmlreq.open(tipo, "http://andrebordignon.esy.es/php/deletacandidato.php?" + idCandidato, true);
    xmlreq.send();
    xmlreq.onreadystatechange = function () {
        if (xmlreq.readyState == 4 && xmlreq.status == 200) {
            var resposta = xmlreq.responseText;
            
            if (resposta.includes("Registro alterado com sucesso.")) {  
                location.reload();
            }
        }

    }
}

/**
    * Função para consultar os dados
    */
   function getListOfThiefs() {


    var xmlreq = new XMLHttpRequest();
    var tipo = 'GET';
    var assincrona = true;

    // Iniciar uma requisição
    xmlreq.open(tipo, "http://andrebordignon.esy.es/php/consultacandidatos.php", true);

    // Atribui uma função para ser executada sempre que houver uma mudança de ado
    xmlreq.onreadystatechange = function () {

        // Verifica se foi concluído com sucesso e a conexão fechada (readyState=4)
        if (xmlreq.readyState == 4) {

            // Verifica se o arquivo foi encontrado com sucesso
            if (xmlreq.status == 200) {

                var json = $.parseJSON(xmlreq.responseText);
                var tabela = document.getElementById("tabelaConsulta");
                for (let index = 0; index < json.length; index++) {
                    var linhaNova = document.createElement("tr");
                    var idCandidato = document.createElement("td");
                    var name = document.createElement("td");
                    var sex = document.createElement("td");
                    var date = document.createElement("td");
                    var street = document.createElement("td");
                    var number = document.createElement("td");
                    var city = document.createElement("td");
                    var state = document.createElement("td");
                    var cpf = document.createElement("td");
                    var cadjus = document.createElement("td");
                    var email = document.createElement("td");
                    var password = document.createElement("td");

                    if (json[index].nome.length > 0) {
                        idCandidato.appendChild(document.createTextNode(json[index].idcandidato));
                        name.appendChild(document.createTextNode(json[index].nome));
                        sex.appendChild(document.createTextNode(json[index].sexo));
                        date.appendChild(document.createTextNode(json[index].datanasc));
                        street.appendChild(document.createTextNode(json[index].rua));
                        number.appendChild(document.createTextNode(json[index].numero));
                        city.appendChild(document.createTextNode(json[index].cidade));
                        state.appendChild(document.createTextNode(json[index].estado));
                        cpf.appendChild(document.createTextNode(json[index].cpf));
                        cadjus.appendChild(document.createTextNode(json[index].cadjus));
                        email.appendChild(document.createTextNode(json[index].email));
                        password.appendChild(document.createTextNode(json[index].senha));
                    
                        linhaNova.appendChild(idCandidato);
                        linhaNova.appendChild(name);
                        linhaNova.appendChild(sex);
                        linhaNova.appendChild(date);
                        linhaNova.appendChild(street);
                        linhaNova.appendChild(number);
                        linhaNova.appendChild(city);
                        linhaNova.appendChild(state);
                        linhaNova.appendChild(cpf);
                        linhaNova.appendChild(cadjus);
                        linhaNova.appendChild(email);
                        linhaNova.appendChild(password);

                        tabela.appendChild(linhaNova);
                    }




                }
            } else {
                result.innerHTML = "Erro: " + xmlreq.statusText;
            }
        }
    };
    xmlreq.send(null);
}
