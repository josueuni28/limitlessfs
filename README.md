# limitlessfs
Leitor de arquivo de configuração personalizado para Node.js

# Instalação
```txt
$ npm i limitlessfs
```
# Documentação
Veja a documentação completa em [**github.io/limitlessfs**](https://josueuni28.github.io/limitlessfs/)
<br>
<p>O Limitlessfs lê arquivos personalizados que são usados para configurar uma Aplicação. O nome "<em>limitless</em>" deriva da capacidade "reconhecer" multíplos padrões em um arquivo.</p>
<p>Pode ser usado como alternativa para o JSON, se você tem ou precisa de um arquivo de configuração com regras específicas e modificável, ou desejar usar padrões que não são permitidos no JSON, como comentários, por exemplo.</p>

# Exemplo de leitura
Veja o exemplo de uma configuração usando a maioria dos recursos **limitlessfs** em uma aplicação para gerar sequências aleatórias, e o arquivo `.txt` que é possível ler, aplicando essas configurações:<br>

*Arquivo texto de configuração da aplicação - `entradas.txt`:*
```txt
## Arquivo de Configuração da Aplicação "rands.js"

>> BASE...
   Números a cercar    = 1 até 31
   Iteração            = 1
   Comprimento do jogo = 20

>> DETALHES...
   Números fixos         : 
   Números excluídos     : 
   Combinações a excluir = ''

>> PERSONALIZAÇÃO...
   Números ordenados                = sim
   Pode repetir combinações?        = não
   Abrir arquivo quando finalizar!? = sim

>> FINALIZAÇÃO...
   Total de combinações  : 100
   Nome do arquivo final = Loterias
```

*Arquivo JS de configuração separado do **limitlessfs** - `configLimitlessfs.js`:*

```js
const limitlessfs = require('limitlessfs')

// Personalizar as mensagens de ATENÇÃO e ERRO:
limitlessfs.__msg.fileNotFound = 'Não encontrou o arquivo {0}'
limitlessfs.__msg.lineRequire = 'Coloque a linha "{0}" ai'
limitlessfs.__msg.emplyLineParam = 'ATENÇÃO: A linha ({0}) está "{1}". O valor será convertido para "{2}"'
limitlessfs.__msg.errorLineParam = 'ERRO no valor "{0}", passado como parâmetro da linha: {1}'
limitlessfs.__msg.emplyLineParamSetted = 'AVISO: A linha ({0}) de valor definido está "{1}". O valor será convertido para o "valor padrão".'

// Personalizar as tags de comentário:
limitlessfs.__defaultValues.comment = ['##','>>']

limitlessfs._config = {
  _separator: ['=',':'], // Como o arquivo txt tem dois tipos de separador, passamos os dois
  _true: 'sim', // Reconhecer o tipo True
  _false: 'nao', // Reconhecer o tipo False
  _split: [' ate ',',',' a '], // Passando os separadores de Array
  _ignoreCharacter: ['?','!'], // Strings que serão ignoradas/removida da leitura no arquivo
  _blocks: [
  {
    line: 'numeros a cercar', // Identificando a linha
    render: 'range', // Passando qual o nome do atributo no Objeto final. Ex: limitlessfs.range
    value: Array // Tipo do valor do atributo
  },
  {
    line: ['iteracao','pulo','avanco','sequencia'],
    render: 'sequential',
    value: Number,
    require: false, // Informando que essa linha não será obrigatória 
    default: 1 // O valor default do atributo, caso a linha não seja escrita
  },
  {
    line: 'numeros fixos',
    render: 'fixedNum',
    value: Array,
    require: false,
  },
  {
    line: ['numeros excluidos','numeros a excluir','numeros removidos','numeros a remover'],
    render: 'excludeNum',
    value: Array,
    require: false,
  },
  {
    line: ['combinacoes a excluir','combinacoes excluidas','combinacoes para excluir'],
    render: 'excludeCombinations',
    require: false,
  },
  {
    line: ['comprimento do jogo','comprimento do cartao'],
    render: 'width',
  },
  {
    line: ['total de combinacoes','total de jogos'],
    render: 'total',
    require: false,
    default: 1
  },
  {
    line: ['numeros ordenados','em ordem'],
    render: 'sorted',
    require: false,
  },
  {
    line: ['pode repetir combinacoes','pode ter combinacoes repetidas'],
    render: 'norepeat',
    require: false,
  },
  {
    line: ['nome do arquivo final','nome final do arquivo','arquivo de saida'],
    render: 'filename',
    // Por ser um nome, informando que o valor dessa linha deve ser preservado o Case Sensitive
    caseSensitive: true,
    require: false,
    default: 'rand'
  },
  {
    line: ['abrir arquivo quando finalizar','abrir ao finalizar'],
    render: 'openfileFinished',
    require: false,
  }]
}

limitlessfs._read('../entradas.txt')
module.exports = limitlessfs
```

Arquivo da Aplicação - `rands.js`:
```js
const config = require('./configLimitlessfs')

console.log(config)
// Resultado no console:
```
```txt
{
  range: [ 1, 31 ],
  sequential: 1,
  fixedNum: [],
  excludeNum: [],
  excludeCombinations: '',
  width: 20,
  total: 100,
  sorted: true,
  norepeat: false,
  filename: 'Loterias',
  openfileFinished: true
}
```
