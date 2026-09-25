/* =========================================================
   SISTEMA DE MENTORIA FLORESCER
   JavaScript inicial do front-end
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const btnEntrar = document.getElementById("btnEntrar");
    const statusMessage = document.getElementById("statusMessage");

    if (statusMessage) {
        statusMessage.textContent =
            "Front-end carregado com sucesso.";
    }

    if (btnEntrar) {
        btnEntrar.addEventListener("click", () => {
            alert(
                "A autenticação do Google será configurada nesta etapa do projeto."
            );
        });
    }
});
