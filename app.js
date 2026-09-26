/*
=========================================================
SISTEMA DE MENTORIA FLORESCER
Autenticação Google - Front-end
=========================================================
*/

const GOOGLE_CLIENT_ID =
  "363943058105-4n8kuuic4a952dqmcjhn1rjr2f375bgk.apps.googleusercontent.com";

const API_URL =
  "https://script.google.com/macros/s/AKfycbxkltKbtzpi4YkOW-qHmFcBpKge1bn5HSj3RnO4gqxL32ZCMGhg2kPv1fbKKzAgz1w9/exec";


document.addEventListener("DOMContentLoaded", () => {

  const btnEntrar = document.getElementById("btnEntrar");
  const statusMessage = document.getElementById("statusMessage");

  if (statusMessage) {
    statusMessage.textContent = "Front-end carregado com sucesso.";
  }

  if (!btnEntrar) {
    console.error("Botão btnEntrar não encontrado.");
    return;
  }

  carregarGoogleIdentityServices();

});


/*
=========================================================
CARREGA A BIBLIOTECA OFICIAL DO GOOGLE
=========================================================
*/

function carregarGoogleIdentityServices() {

  if (window.google && google.accounts && google.accounts.id) {
    configurarGoogleLogin();
    return;
  }

  const script = document.createElement("script");

  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;

  script.onload = () => {
    configurarGoogleLogin();
  };

  script.onerror = () => {
    mostrarStatus(
      "Não foi possível carregar a autenticação do Google.",
      true
    );
  };

  document.head.appendChild(script);
}


/*
=========================================================
CONFIGURA GOOGLE IDENTITY SERVICES
=========================================================
*/

function configurarGoogleLogin() {

  const btnEntrar = document.getElementById("btnEntrar");

  if (!btnEntrar) return;

  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: receberTokenGoogle
  });

  /*
  Cria um espaço para o botão oficial do Google.
  */

  const container = document.createElement("div");

  container.id = "googleLoginContainer";

  btnEntrar.parentNode.insertBefore(container, btnEntrar);

  google.accounts.id.renderButton(container, {
    type: "standard",
    theme: "filled_blue",
    size: "large",
    text: "signin_with",
    shape: "rectangular",
    width: 240
  });

  /*
  Esconde temporariamente o botão antigo.
  */

  btnEntrar.style.display = "none";

}


/*
=========================================================
RECEBE O ID TOKEN DO GOOGLE
=========================================================
*/

async function receberTokenGoogle(response) {

  if (!response || !response.credential) {

    mostrarStatus(
      "Não foi possível obter a autenticação do Google.",
      true
    );

    return;
  }

  const idToken = response.credential;

  mostrarStatus("Validando seu acesso...");

  try {

    /*
    O token é enviado ao backend para validação.
    */

    const url =
      API_URL +
      "?action=me&id_token=" +
      encodeURIComponent(idToken);

    const resposta = await fetch(url, {
      method: "GET",
      redirect: "follow"
    });

    if (!resposta.ok) {
      throw new Error(
        "O servidor retornou o status " + resposta.status
      );
    }

    const dados = await resposta.json();

    console.log("Resposta do backend:", dados);

    /*
    Guarda o token apenas durante a sessão do navegador.
    */

    sessionStorage.setItem(
      "florescer_google_id_token",
      idToken
    );

    mostrarStatus("Login realizado com sucesso!");

  } catch (erro) {

    console.error("Erro na autenticação:", erro);

    mostrarStatus(
      "Não foi possível validar o acesso. Verifique o backend.",
      true
    );

  }

}


/*
=========================================================
MENSAGEM DE STATUS
=========================================================
*/

function mostrarStatus(mensagem, erro = false) {

  const statusMessage =
    document.getElementById("statusMessage");

  if (!statusMessage) return;

  statusMessage.textContent = mensagem;

  if (erro) {
    statusMessage.style.color = "#b42318";
  } else {
    statusMessage.style.color = "";
  }

}
