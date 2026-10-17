# -*- coding: utf-8 -*-
"""Dados reais das empresas de PERAINS ON (lote 1) para os PDFs do Calima.

Chaves correspondem aos marcadores {{...}} de cadastro-empresa-template.html.
Marcadores com @N sao substituidos apenas na N-esima ocorrencia.
"""

COMUNS = {
    "ORGAO_REGISTRO": "JUCERJ — Junta Comercial do Estado do Rio de Janeiro",
    "SITUACAO": "Ativa",
    "ATIVA": "Ativa",
    "TIPO_CONTRIBUICAO_SN": "Alíquota básica",
    "STATUS_VIGENCIA": "Tributação vigente",
    "CUMULATIVO": "Cumulativo",
    "NAO_CUMULATIVO": "Não cumulativo",
    "S_LUCRO_REAL": "Só Lucro Real",
    "NAO_SE_APLICA": "(não se aplica)",
    "SE_HOUVER": "(se houver)",
    "VAZIO": "(vazio)",
    "VAZIO_SE_VIGENTE": "(vazio, se vigente)",
    "VAZIO_EXCETO_ALGUNS_ESTADOS_MUNICIPIOS": "(vazio, exceto alguns estados/municípios)",
    "VAZIO_EXCETO_ZONA_FRANCA_DE_MANAUS": "(vazio, exceto Zona Franca de Manaus)",
    "ESTABELECIMENTO_SEDE": "Estabelecimento / Sede",
    "IMPORTACAO_MANAD_RAIS_SEFIP": "Importação Manad/Rais/Sefip",
    "MM_AAAA": "01/2024",
    "TIPO_TRIBUTACAO": "Simples Nacional",
    "SELECAO_SIM_NAO": "Sim / Não",
    "SIM_NAO": "Sim / Não",
    "SITUACAO": "Ativa",
    "ATIVA": "Ativa",
    "CONTADOR": "WELLINGTON BATISTA PEREIRA — CPF 004.118.247-24",
    "EFETIVA_EFETIVA_ESTIMADA": "Efetiva / efetiva estimada",
    "SIMPLES_NACIONAL_LUCRO_PRESUMIDO_LUCRO_REAL": "Simples Nacional — optante desde 01/2024",
    "IMPORTACAO_MANAD_RAIS_SEFIP": "Importação Manad/Rais/Sefip",
    "TITULO": "CALIMA-ERP-Cadastro",
    "BADGE": "CADASTRO REAL",
    "00": "(preencher)",
    "AVISO_CAPA": "Dados reais.",
    "AVISO_CAPA_RESTO": (
        " Os valores deste manual foram extraídos dos documentos da empresa e devem "
        "ser digitados no Calima exatamente como estão. Onde não há documento no acervo, "
        "o campo aparece como pendência na seção 9 — não invente valor em campo que vai "
        "para o fisco. Os Anexos A (cadastro de funcionário) e B (empréstimo "
        "consignado) aplicam-se quando houver folha de pagamento ativa."
    ),
}

EMPRESES = [
    (
        "padaria-eleones",
        "CALIMA-ERP-Cadastro-Padaria-Eleones.pdf",
        {
            "TITULO": "CALIMA-ERP-Cadastro — Padaria Confeitaria e Lanchonete do Eleones Ltda",
            "TITULO_RODAPE": "CALIMA-ERP-Cadastro-Padaria-Eleones",
            "SUBTITULO": "Passo a passo de cadastro — Padaria Confeitaria e Lanchonete do Eleones Ltda",
            "BADGE": "CADASTRO REAL — DADOS DOS DOCUMENTOS DA EMPRESA",
            "RAZAO_SOCIAL_COMPLETA_CONFORME_CNPJ": "PADARIA CONFEITARIA E LANCHONETE DO ELEONES LTDA",
            "RAZAO_SOCIAL": "PADARIA CONFEITARIA E LANCHONETE DO ELEONES LTDA",
            "NOME_FANTASIA": "PADARIA DO ELEONE",
            "00_000_000_0001_00": "24.067.411/0001-62",
            "00_000_00_0": "13.346.78-0",
            "CNAE_COMPLETO": "10.91-1/01 — Fabricação de produtos de panificação industrial",
            "SIMPLES_NACIONAL_LUCRO_PRESUMIDO_LUCRO_REAL_MEI": "Simples Nacional — não optante Simei, desde 01/01/2025",
            "CNAE@1": "10.91-1/01",
            "CNAE@2": "10.91-1/02",
            "CNAE@3": "47.21-1/02",
            "CNAE_DESC_PRINCIPAL": "Fabricação de produtos de panificação industrial",
            "CNAE_DESC_SEC1": "Fabricação de produtos de padaria e confeitaria com predominância de produção própria",
            "CNAE_DESC_SEC2": "Padaria e confeitaria com predominância de revenda",
            "000_000_0000_0": "338.0828400-0",
            "DD_MM_AAAA": "28/01/2016",
            "00": "25",
            "RUA_AVENIDA": "Rua Elias Maron",
            "00000_000": "28.230-000",
            "BAIRRO": "CENTRO",
            "MUNICIPIO_UF": "São Francisco de Itabapoana / RJ",
            "VAZIO_OU_SALA_APT_CASA": "(vazio)",
            "0000": "(a gerar no portal do Simples Nacional)",
            "0000000": "1091101",
            "000": "2",
            "RESPONSAVEL": "SUELLEM BARRETO DE AZEVEDO — CPF 112.503.897-71",
            "NOME_DO_CONTADOR": "WELLINGTON BATISTA PEREIRA — CPF 004.118.247-24",
            "NATUREZA_JURIDICA_PADRAO": "206-2 — Sociedade Empresária Limitada",
            "NATUREZA_JURIDICA": "206-2 — Sociedade Empresária Limitada",
            "CONFORME_CNPJ": "206-2 — Sociedade Empresária Limitada",
            "CONFORME_EMPRESA": "Sociedade Empresária",
            "CAPITAL": "R$ 100.000,00 — 100.000 quotas de R$ 1,00",
            "SOCIO": "SUELLEM BARRETO DE AZEVEDO — CPF 112.503.897-71",
            "ENDERECO_SEDE": "Rua Elias Maron, 25 — Centro — CEP 28.230-000",
            "INICIO_ATIVIDADE": "28/01/2016",
            "FONTE@1": "Cartão CNPJ, 25/03/2025",
            "FONTE@2": "Cartão CNPJ, 25/03/2025",
            "FONTE@3": "JUCERJ, protocolo 2025/00347991-4",
            "FONTE@4": "Cartão CNPJ / certidão JUCERJ",
            "FONTE@5": "JUCERJ, cláusula 4",
            "FONTE@6": "JUCERJ, cláusulas 1 e 5",
            "FONTE@7": "JUCERJ, cláusula 1",
            "FONTE@8": "JUCERJ, cláusula 3",
            "FONTE@9": "SEFAZ-RJ, 15/06/2026",
            "FONTE@10": "Escritório contábil",
            "PENDENCIAS": (
                "Código de acesso do Simples Nacional (4 dígitos) — gerar no portal, exige certificado e CPF do responsável.<br />"
                "Data de vencimento do alvará de funcionamento — não localizada no acervo do Drive.<br /><br />"
                "<b>Confirmações já feitas:</b> NIRE 338.0828400-0 (JUCERJ, protocolo 2025/00347991-4, arquivado 25/03/2025); "
                "transformação de MEI (SUELLEM BARRETO DE AZEVEDO 11250389771) em Sociedade Limitada Unipessoal no mesmo ato; "
                "natureza jurídica 206-2; capital social R$ 100.000,00; Sócia-administradora SUELLEM BARRETO DE AZEVEDO, "
                "CPF 112.503.897-71, RG 2133.83516 DETRAN/RJ; endereço sede Rua Elias Maron, 25; início de atividade 28/01/2016; "
                "Inscrição Estadual 13.346.78-0; contador WELLINGTON BATISTA PEREIRA, CPF 004.118.247-24."
            ),
        },
    ),
    (
        "rv-leite-otica",
        "CALIMA-ERP-Cadastro-RV-Leite-Otica.pdf",
        {
            "TITULO": "CALIMA-ERP-Cadastro — R. V. Leite Óptica",
            "TITULO_RODAPE": "CALIMA-ERP-Cadastro-RV-Leite-Otica",
            "SUBTITULO": "Passo a passo de cadastro — R. V. Leite Óptica",
            "BADGE": "CADASTRO REAL — DADOS DOS DOCUMENTOS DA EMPRESA",
            "RAZAO_SOCIAL_COMPLETA_CONFORME_CNPJ": "R. V. LEITE OTICA",
            "RAZAO_SOCIAL": "R. V. LEITE OTICA",
            "NOME_FANTASIA": "RV LEITE",
            "00_000_000_0001_00": "03.116.103/0001-00",
            "00_000_00_0": "(não localizado no acervo)",
            "CNAE_COMPLETO": "47.74-1/00 — Comércio varejista de artigos de óptica",
            "SIMPLES_NACIONAL_LUCRO_PRESUMIDO_LUCRO_REAL_MEI": "Simples Nacional — Microempresa",
            "CNAE@1": "47.74-1/00",
            "CNAE@2": "(não informado)",
            "CNAE@3": "(não informado)",
            "CNAE_DESC_PRINCIPAL": "Comércio varejista de artigos de óptica",
            "CNAE_DESC_SEC1": "O cartão CNPJ registra 'Não informada' para as atividades secundárias",
            "CNAE_DESC_SEC2": "—",
            "000_000_0000_0": "331.0403258-5",
            "DD_MM_AAAA": "08/10/1998",
            "00": "414",
            "RUA_AVENIDA": "Avenida 7 de Setembro",
            "00000_000": "28.030-002",
            "BAIRRO": "CENTRO",
            "MUNICIPIO_UF": "Campos dos Goytacazes / RJ",
            "VAZIO_OU_SALA_APT_CASA": "(vazio)",
            "0000": "(a gerar no portal do Simples Nacional)",
            "0000000": "4774100",
            "000": "(deixe em branco)",
            "RESPONSAVEL": "Titular (Empresário Individual)",
            "NOME_DO_CONTADOR": "WELLINGTON BATISTA PEREIRA — CPF 004.118.247-24",
            "NATUREZA_JURIDICA_PADRAO": "213-5 — Empresário (Individual)",
            "NATUREZA_JURIDICA": "213-5 — Empresário (Individual)",
            "CONFORME_CNPJ": "213-5 — Empresário (Individual)",
            "CONFORME_EMPRESA": "Empresário Individual",
            "CAPITAL": "(não aplicável a Empresário Individual)",
            "SOCIO": "RONALDO VIEIRA LEITE",
            "ENDERECO_SEDE": "Av. 7 de Setembro, 414 — Centro — CEP 28.030-002",
            "INICIO_ATIVIDADE": "08/10/1998",
            "FONTE@1": "Cartão CNPJ, 03/06/2026",
            "FONTE@2": "Cartão CNPJ, 03/06/2026",
            "FONTE@3": "JUCERJ, protocolo 10-2019/624172-3",
            "FONTE@4": "Cartão CNPJ",
            "FONTE@5": "Não aplicável a Empresário Individual",
            "FONTE@6": "Cartão CNPJ / certidão JUCERJ",
            "FONTE@7": "Cartão CNPJ",
            "FONTE@8": "Cartão CNPJ, cláusula 3",
            "FONTE@9": "Não localizado",
            "FONTE@10": "Escritório contábil",
            "PENDENCIAS": (
                "Inscrição Estadual — não localizada no acervo do Drive.<br />"
                "Código de acesso do Simples Nacional — gerar no portal.<br />"
                "CPF do titular — confirmar na ficha cadastral.<br />"
                "Alvará e data de vencimento — não localizados.<br /><br />"
                "<b>Confirmações já feitas:</b> NIRE 331.0403258-5 (JUCERJ, protocolo 10-2019/624172-3, de 14/10/2019); "
                "natureza jurídica 213-5 Empresário (Individual); CNAE principal 47.74-1/00; "
                "início de atividade 08/10/1998; endereço Av. 7 de Setembro, 414, Centro, Campos dos Goytacazes/RJ."
            ),
        },
    ),
    (
        "salgaderia-da-nique",
        "CALIMA-ERP-Cadastro-Salgaderia-da-Nique.pdf",
        {
            "TITULO": "CALIMA-ERP-Cadastro — Salgaderia da Nique Ltda",
            "TITULO_RODAPE": "CALIMA-ERP-Cadastro-Salgaderia-da-Nique",
            "SUBTITULO": "Passo a passo de cadastro — Salgaderia da Nique Ltda",
            "BADGE": "CADASTRO REAL — DADOS DOS DOCUMENTOS DA EMPRESA",
            "RAZAO_SOCIAL_COMPLETA_CONFORME_CNPJ": "SALGADERIA DA NIQUE LTDA",
            "RAZAO_SOCIAL": "SALGADERIA DA NIQUE LTDA",
            "NOME_FANTASIA": "SALGADERIA DA NIQUE",
            "00_000_000_0001_00": "52.508.410/0001-41",
            "00_000_00_0": "(não localizado no acervo)",
            "CNAE_COMPLETO": "56.11-2/01 — Restaurantes e similares",
            "SIMPLES_NACIONAL_LUCRO_PRESUMIDO_LUCRO_REAL_MEI": "Simples Nacional — Microempresa",
            "CNAE@1": "56.11-2/01",
            "CNAE@2": "56.11-2/03",
            "CNAE@3": "(conforme cartão CNPJ atualizado)",
            "CNAE_DESC_PRINCIPAL": "Restaurantes e similares",
            "CNAE_DESC_SEC1": "Lanchonetes, casas de chá, de sucos e similares",
            "CNAE_DESC_SEC2": "Consulte o cartão CNPJ atualizado",
            "000_000_0000_0": "332.1289276-0",
            "DD_MM_AAAA": "10/10/2023",
            "00": "114",
            "RUA_AVENIDA": "Avenida Sampaio Correa",
            "00000_000": "22.713-560",
            "BAIRRO": "JACAREPAGUA",
            "MUNICIPIO_UF": "Rio de Janeiro / RJ",
            "VAZIO_OU_SALA_APT_CASA": "Loja 1",
            "0000": "(a gerar no portal do Simples Nacional)",
            "0000000": "5611201",
            "000": "(deixe em branco)",
            "RESPONSAVEL": "MUNIQUE DO NASCIMENTO — administrador",
            "NOME_DO_CONTADOR": "WELLINGTON BATISTA PEREIRA — CPF 004.118.247-24",
            "NATUREZA_JURIDICA_PADRAO": "206-2 — Sociedade Empresária Limitada",
            "NATUREZA_JURIDICA": "206-2 — Sociedade Empresária Limitada",
            "CONFORME_CNPJ": "206-2 — Sociedade Empresária Limitada",
            "CONFORME_EMPRESA": "Sociedade Empresária",
            "CAPITAL": "R$ 90.000,00 — dividido em 90.000 quotas",
            "SOCIO": "MUNIQUE DO NASCIMENTO",
            "ENDERECO_SEDE": "Av. Sampaio Correa, 114 — Loja 1 — Jacarepaguá — CEP 22.713-560",
            "INICIO_ATIVIDADE": "10/10/2023",
            "FONTE@1": "Cartão CNPJ, 29/01/2025",
            "FONTE@2": "Cartão CNPJ, 29/01/2025",
            "FONTE@3": "JUCERJ, protocolo 00-2023/795770-1",
            "FONTE@4": "Contrato social, cláusula primeira",
            "FONTE@5": "Contrato social, cláusula quinta",
            "FONTE@6": "Contrato social, cláusulas segunda e sexta",
            "FONTE@7": "Contrato social, cláusula segunda",
            "FONTE@8": "Contrato social, cláusula quarta",
            "FONTE@9": "Não localizado",
            "FONTE@10": "Escritório contábil",
            "PENDENCIAS": (
                "Inscrição Estadual — não localizada no acervo do Drive.<br />"
                "Código de acesso do Simples Nacional — gerar no portal.<br />"
                "CPF do administrador MUNIQUE DO NASCIMENTO — ler do contrato social.<br />"
                "Demais CNAEs secundários — consultar o cartão CNPJ atualizado.<br /><br />"
                "<b>Confirmações já feitas:</b> NIRE 332.1289276-0 (JUCERJ, protocolo 00-2023/795770-1); "
                "capital social R$ 90.000,00 em 90.000 quotas (cláusula quinta); início de atividade 10/10/2023 "
                "(cláusula quarta); sede na Av. Sampaio Correa (cláusula segunda); administração por "
                "MUNIQUE DO NASCIMENTO (cláusula sexta)."
            ),
        },
    ),
    (
        "padaria-sabor-de-minas",
        "CALIMA-ERP-Cadastro-Padaria-Sabor-de-Minas.pdf",
        {
            "TITULO": "CALIMA-ERP-Cadastro — Padaria Sabor de Minas, Confeitaria e Lanchonete Ltda",
            "TITULO_RODAPE": "CALIMA-ERP-Cadastro-Padaria-Sabor-de-Minas",
            "SUBTITULO": "Passo a passo de cadastro — Padaria Sabor de Minas, Confeitaria e Lanchonete Ltda",
            "BADGE": "CADASTRO REAL — DADOS DOS DOCUMENTOS DA EMPRESA",
            "RAZAO_SOCIAL_COMPLETA_CONFORME_CNPJ": "PADARIA SABOR DE MINAS, CONFEITARIA E LANCHONETE LTDA",
            "RAZAO_SOCIAL": "PADARIA SABOR DE MINAS, CONFEITARIA E LANCHONETE LTDA",
            "NOME_FANTASIA": "PADARIA SABOR DE MINAS",
            "00_000_000_0001_00": "64.053.537/0001-00",
            "00_000_00_0": "(não localizado no acervo)",
            "CNAE_COMPLETO": "10.91-1/01 — Fabricação de produtos de panificação industrial",
            "SIMPLES_NACIONAL_LUCRO_PRESUMIDO_LUCRO_REAL_MEI": "Simples Nacional — Microempresa",
            "CNAE@1": "10.91-1/01",
            "CNAE@2": "10.91-1/02",
            "CNAE@3": "47.21-1/02",
            "CNAE_DESC_PRINCIPAL": "Fabricação de produtos de panificação industrial",
            "CNAE_DESC_SEC1": "Fabricação de produtos de padaria e confeitaria com predominância de produção própria",
            "CNAE_DESC_SEC2": "Padaria e confeitaria com predominância de revenda",
            "000_000_0000_0": "338.3621579-3",
            "DD_MM_AAAA": "15/12/2025",
            "00": "101",
            "RUA_AVENIDA": "Rua Projetada, s/nº, entrada 11 — Av. R. Ferreira Paes",
            "00000_000": "28.230-000",
            "BAIRRO": "CENTRO",
            "MUNICIPIO_UF": "São Francisco de Itabapoana / RJ",
            "VAZIO_OU_SALA_APT_CASA": "Loja — Travessão de Barra",
            "0000": "(a gerar no portal do Simples Nacional)",
            "0000000": "1091101",
            "000": "(deixe em branco)",
            "RESPONSAVEL": "RONALDO DOS SANTOS ANANIAS — CPF 045.761.146-46",
            "NOME_DO_CONTADOR": "WELLINGTON BATISTA PEREIRA — CPF 004.118.247-24",
            "NATUREZA_JURIDICA_PADRAO": "206-2 — Sociedade Empresária Limitada",
            "NATUREZA_JURIDICA": "206-2 — Sociedade Empresária Limitada",
            "CONFORME_CNPJ": "206-2 — Sociedade Empresária Limitada",
            "CONFORME_EMPRESA": "Sociedade Empresária",
            "CAPITAL": "R$ 120.000,00 — dividido em 120.000 quotas de R$ 1,00",
            "SOCIO": "RONALDO DOS SANTOS ANANIAS — CPF 045.761.146-46",
            "ENDERECO_SEDE": "Rua Projetada, s/nº, entrada 11, Av. R. Ferreira Paes, 101, loja — Centro, Travessão de Barra",
            "INICIO_ATIVIDADE": "15/12/2025",
            "FONTE@1": "Cartão CNPJ, 13/03/2026",
            "FONTE@2": "Cartão CNPJ, 13/03/2026",
            "FONTE@3": "JUCERJ, protocolo 2026/00349535-0",
            "FONTE@4": "Cartão CNPJ / certidão JUCERJ",
            "FONTE@5": "Contrato social, cláusula segunda",
            "FONTE@6": "Contrato social, cláusulas primeira e quinta",
            "FONTE@7": "Contrato social, cláusula primeira",
            "FONTE@8": "Contrato social, cláusula terceira",
            "FONTE@9": "Não localizado",
            "FONTE@10": "Escritório contábil",
            "PENDENCIAS": (
                "Inscrição Estadual — não localizada no acervo do Drive.<br />"
                "Código de acesso do Simples Nacional — gerar no portal.<br /><br />"
                "<b>Confirmações já feitas:</b> NIRE 338.3621579-3 (JUCERJ, protocolo 2026/00349535-0, arquivado 13/03/2026); "
                "capital social R$ 120.000,00 em 120.000 quotas (cláusula segunda); Sócio-administrador "
                "RONALDO DOS SANTOS ANANIAS, CPF 045.761.146-46, RG MG8210763 SSP/MG, nascido 18/09/1979; "
                "início de atividade 15/12/2025 (cláusula terceira). Ato 046 — Transformação, de Empresário "
                "Individual (NIRE 33808284000) para Limitada."
            ),
        },
    ),
]

for _slug, _pdf, _d in EMPRESES:
    _d.update(COMUNS)