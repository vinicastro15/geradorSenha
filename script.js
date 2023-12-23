function generatePassword() {
    const length = document.getElementById("length").value;
    const includeUppercase = document.getElementById("includeUppercase").checked;
    const includeLowercase = document.getElementById("includeLowercase").checked;
    const includeNumbers = document.getElementById("includeNumbers").checked;
    const includeSymbols = document.getElementById("includeSymbols").checked;

    const charset = generateCharset(includeUppercase, includeLowercase, includeNumbers, includeSymbols);
    let password = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    document.getElementById("password").value = password;
    // Avalie a força da senha e atualize a barra de progresso
    updateStrengthMeter(password);

    // Adicione um alerta se a senha for muito pequena
    if (password.length < 5) {
        alert("A senha gerada é muito pequena. Considere aumentar o comprimento ou incluir mais opções.");
    }

}

function generateCharset(includeUppercase, includeLowercase, includeNumbers, includeSymbols) {
    let charset = "";

    if (includeUppercase) {
        charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }

    if (includeLowercase) {
        charset += "abcdefghijklmnopqrstuvwxyz";
    }

    if (includeNumbers) {
        charset += "0123456789";
    }

    if (includeSymbols) {
        charset += "!@#$%^&*()_+";
    }

    return charset;
}

//
function savePassword() {
    const passwordField = document.getElementById("password");
    const passwordList = document.getElementById("passwordList");

    const password = passwordField.value;

    if (password.trim() !== "") {
        // Verifica se a senha já está na lista para evitar duplicatas
        if (!passwordList.innerHTML.includes(password)) {
            // Adiciona a senha à lista na página
            const listItem = document.createElement("li");
            listItem.textContent = password;
            passwordList.appendChild(listItem);

            // Salva a senha no localStorage
            const savedPasswords = JSON.parse(localStorage.getItem("savedPasswords")) || [];
            savedPasswords.push(password);
            localStorage.setItem("savedPasswords", JSON.stringify(savedPasswords));
        } else {
            alert("A senha já está na lista!");
        }
    } else {
        alert("Nenhuma senha para salvar!");
    } 
        
    
}

// Função para carregar senhas salvas ao carregar a página
function loadSavedPasswords() {
    const savedPasswords = JSON.parse(localStorage.getItem("savedPasswords")) || [];
    const passwordList = document.getElementById("passwordList");

    savedPasswords.forEach(password => {
        const listItem = document.createElement("li");
        listItem.textContent = password;
        passwordList.appendChild(listItem);
    });
    
}

// Aguarde o carregamento completo do DOM antes de chamar a função
document.addEventListener("DOMContentLoaded", function () {
    loadSavedPasswords();
});

function updateStrengthMeter(password) {
    const strengthBar = document.getElementById("strength-bar");

    // Avalie a força da senha (exemplo: comprimento mínimo de 8 caracteres)
    if (password.length >= 8 || password.length > 30) {
        strengthBar.style.width = "33%";
        strengthBar.className = "weak";
    } else {
        strengthBar.style.width = "0";
        strengthBar.className = "";
        return;
    }

    // Adicione mais critérios de avaliação de força conforme necessário
    // Exemplo: verificação de caracteres maiúsculos, minúsculos, números, símbolos, etc.

    // Exemplo: Avaliação de força para senhas médias
    if (/[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
        strengthBar.style.width = "66%";
        strengthBar.className = "medium";
    }

    // Exemplo: Avaliação de força para senhas fortes
    if (/[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password) && password.length >= 12) {
        strengthBar.style.width = "100%";
        strengthBar.className = "strong";
    }
}

function copyToClipboard() {
    const passwordField = document.getElementById("password");

    // Cria um elemento de área de texto temporário
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = passwordField.value;

    // Adiciona o elemento de área de texto temporário ao corpo do documento
    document.body.appendChild(tempTextArea);

    // Seleciona o conteúdo do elemento de área de texto temporário
    tempTextArea.select();
    tempTextArea.setSelectionRange(0, 99999); // Para navegadores móveis

    // Copia o conteúdo para a área de transferência
    document.execCommand("copy");

    // Remove o elemento de área de texto temporário do corpo do documento
    document.body.removeChild(tempTextArea);

    alert("Senha copiada para a área de transferência!");
}

// Função para excluir senha salva
function deletePassword(passwordId) {
    const passwordList = document.getElementById("passwordList");

    // Remove o item da lista
    const listItem = document.getElementById(passwordId);
    passwordList.removeChild(listItem);

    // Atualiza o localStorage removendo a senha excluída
    const savedPasswords = JSON.parse(localStorage.getItem("savedPasswords")) || [];
    const updatedPasswords = savedPasswords.filter(password => password !== passwordId);
    localStorage.setItem("savedPasswords", JSON.stringify(updatedPasswords));
}

// Função para excluir todas as senhas salvas
function deleteAllPasswords() {
    const passwordList = document.getElementById("passwordList");

    // Remove todos os itens da lista
    while (passwordList.firstChild) {
        passwordList.removeChild(passwordList.firstChild);
    }

    // Limpa o localStorage
    localStorage.removeItem("savedPasswords");
}

// Função para salvar senha com nome
function savePasswordWithUsername() {
    const passwordField = document.getElementById("password");
    const savedPasswordNameField = document.getElementById("savedPasswordName");
    const passwordList = document.getElementById("passwordList");

    // Exiba o botão de exclusão apenas se houver senhas salvas
    const deleteAllButton = document.getElementById("deleteAllButton");

    if (deleteAllButton) {
        deleteAllButton.style.display = "block";
    }

    const password = passwordField.value;
    const savedPasswordName = savedPasswordNameField.value;

    if (password.trim() !== "" && savedPasswordName.trim() !== "") {
        // Cria um novo item da lista com o nome e a senha
        const listItem = document.createElement("li");
        listItem.textContent = `${savedPasswordName}: ${password}`;

        // Adiciona um botão de exclusão
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Excluir";
        deleteButton.onclick = function() {
            deletePassword(listItem); // Passa o nó <li> para a função deletePassword
        };

        listItem.appendChild(deleteButton);

        // Adiciona o novo item à lista
        passwordList.appendChild(listItem);

        // Salva a senha e o nome no localStorage
        const savedPasswords = JSON.parse(localStorage.getItem("savedPasswords")) || [];
        savedPasswords.push({ name: savedPasswordName, password: password });
        localStorage.setItem("savedPasswords", JSON.stringify(savedPasswords));

        // Limpa os campos
        savedPasswordNameField.value = "";
        passwordField.value = "";

        // Exiba o botão de exclusão apenas se houver senhas salvas
        const deleteAllButton = document.getElementById("deleteAllButton");

        if(deleteAllButton){
            deleteAllButton.style.display = "block";
        }
    } else {
        alert("Preencha o nome e gere uma senha antes de salvar.");
    }
}

// Função para excluir senha salva
function deletePassword(listItem) {
    const passwordList = document.getElementById("passwordList");
    

    // Remove o item da lista
    passwordList.removeChild(listItem);

    // Atualiza o localStorage removendo a senha excluída
    const savedPasswords = JSON.parse(localStorage.getItem("savedPasswords")) || [];
    const updatedPasswords = savedPasswords.filter(passwordObj => passwordObj.name !== listItem.textContent.split(":")[0]);
    localStorage.setItem("savedPasswords", JSON.stringify(updatedPasswords));
}


// Função para excluir todas as senhas salvas
function deleteAllPasswords() {
    const passwordList = document.getElementById("passwordList");

    // Remove todos os itens da lista
    while (passwordList.firstChild) {
        passwordList.removeChild(passwordList.firstChild);
    }

    // Limpa o localStorage
    localStorage.removeItem("savedPasswords");

    // Oculta o botão de exclusão
    const deleteAllButton = document.getElementById("deleteAllButton");

    if (deleteAllButton) {
        deleteAllButton.style.display = "none";
    }
}





