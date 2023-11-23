/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function () {

    beforeEach(() => {
        cy.visit("./src/index.html")
    })

    it('verifica o título da aplicação', function () {

        cy.title().should('eq', 'Central de Atendimento ao Cliente TAT')

    })

    it('preenche os campos obrigatórios e envia o formulário', function () {
        //Utilizando o cy.clock para congelar o relógio do navegador e usaodo o cy.tick para avançar 3s 
        //se certificando que a mensagem não está mais visível
        cy.clock()
        cy.get("#firstName").type("Jonathan", { delay: 0 })
        cy.get("#lastName").type("Cavalcanti", { delay: 0 })
        cy.get("#lastName").type("Cavalcanti", { delay: 0 })
        cy.get("#email").type("qajonat@ig.com.br", { delay: 0 })
        cy.get("#open-text-area").type("Preciso de ajuda sahsauhusshudhudhuduhahudsaiduhsaudsadsidshdsiudhidsaihuduhdaiudsaidsahdsaasd", { delay: 0 })
        cy.contains("button", "Enviar").click()
        cy.get(".success").should("be.visible")
        cy.tick(3000)
        cy.get(".success").should("not.be.visible")

    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function () {

        cy.get("#firstName").type("Jonathan", { delay: 0 })
        cy.get("#lastName").type("Cavalcanti", { delay: 0 })
        cy.get("#lastName").type("Cavalcanti", { delay: 0 })
        cy.get("#email").type("qajonat!ig.com.br", { delay: 0 })
        cy.get("#open-text-area").type("Preciso de ajuda sahsauhusshudhudhuduhahudsaiduhsaudsadsidshdsiudhidsaihuduhdaiudsaidsahdsaasd", { delay: 0 })
        cy.contains("button", "Enviar").click()
        cy.get(".error").should("be.visible")

    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function () {

        cy.get("#firstName").type("Jonathan", { delay: 0 })
        cy.get("#lastName").type("Cavalcanti", { delay: 0 })
        cy.get("#email").type("qajonat@ig.com.br", { delay: 0 })
        cy.get("#open-text-area").type("Preciso de ajuda sahsauhusshudhudhuduhahudsaiduhsaudsadsidshdsiudhidsaihuduhdaiudsaidsahdsaasd", { delay: 0 })
        cy.get("#phone-checkbox").check().should('be.checked')
        cy.contains("button", "Enviar").click()
        cy.get(".error").should("be.visible")

    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function () {

        cy.get("#firstName").type("Jonathan", { delay: 0 }).should('have.value', 'Jonathan').clear().should("have.value", "")
        cy.get("#lastName").type("Cavalcanti", { delay: 0 }).should('have.value', 'Cavalcanti').clear().should("have.value", "")
        cy.get("#email").type("qajonat@ig.com.br", { delay: 0 }).should('have.value', 'qajonat@ig.com.br').clear().should("have.value", "")
        cy.get("#phone").type("51996506802", { delay: 0 }).should('have.value', '51996506802').clear().should("have.value", "")
        cy.get("#open-text-area").type("Preciso de ajuda sahsauhusshudhudhuduhahudsaiduhsaudsadsidshdsiudhidsaihuduhdaiudsaidsahdsaasd", { delay: 0 }).should("have.value", "Preciso de ajuda sahsauhusshudhudhuduhahudsaiduhsaudsadsidshdsiudhidsaihuduhdaiudsaidsahdsaasd")
        cy.contains("button", "Enviar").click()

    })
    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function () {

        cy.contains("button", "Enviar").click()
        cy.get(".error").should("be.visible")

    })

    it('envia o formuário com sucesso usando um comando customizado', function () {

        cy.fillMandatoryFieldsAndSubmit()
        cy.get(".success").should("be.visible")
    })
    it("campo telefone vazio e so deve aceitar numeros", function () {

        cy.get("#phone")
            .type("teststes")
            .should("have.value", "")
    })

    it("verifica que a política de privacidade abre em outra aba sem a necessidade de um clique", function () {


        cy.get("a[href='privacy.html']").should('have.attr', 'target', '_blank')
    })

    //Usando a função invoke para remover o target(elemento responsável por fazer o navegador abrir em uma nova aba)
    //e validando a página no mesmo navegador! 
    Cypress._.times(3, function(){
    it("acessa a página da política de privacidade removendo o target e então clicando no link", function () {


        cy.get("a[href='privacy.html']")
            .invoke('removeAttr', 'target')
            .click()
        cy.contains('Talking About Testing')
    })
})

it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', function() {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })
  it('preenche a area de texto usando o comando invoke', function(){
    const textoLongo = Cypress._.repeat('0123456789',25)
    cy.get('#open-text-area')
    //chamando o valor da variavel textoLongo e setando pelo invoke
    .invoke('val', textoLongo)
    .should('have.value', textoLongo)
   
  })
  it('faz uma requisição HTTP', function(){
    cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
    .should(function(response){
        //desestruturando o response em uma linha os valores em javascript
        const {status, statusText, body} =  response
        //Validando que o statusCode é 200
        expect(status).to.equal(200)
        //Que o texto do status possui o termo OK
        expect(statusText).to.equal('OK')
        console.log(response)
        //E no body inclui a palavra CAC TAT
        expect(body).to.include('CAC TAT')
    })
  })

  it.only('Encontre o gato', function(){
    cy.get('#cat')
    .invoke('show')
    .should('be.visible')
    //usando o invoke para alterar o texto do título da página com a propriedade text DE GATO para CAT TAT hehehe
    .invoke('text', 'CAT TAT')
  })



})