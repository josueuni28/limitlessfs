# limitlessfs
Leitor de arquivo de configuração personalizado para Node.js
<p>Alternativa para o JSON, se você tem ou precisa de um arquivo de configuração personalizado para a sua aplicação.</p>
<h2>Caracteristícas principais</h2>
<ul>
<li>Múltiplos separadores</li>
<li>Comentários (Com tags personalizadas)</li>
<li>Ignora linhas vazias no arquivo</li>
<li>Linhas e valores podem ser opcionais</li>
<li>Definir valores padrão</li>
<li>Mensagens de Erro e Alerta personalizados</li>
<li>Identifica o tipo dos valores automaticamente</li>
<li>Simples de configurar</li>
</ul>

# como usar
> *&nbsp;**README** em construção... Caso veja algum erro, por favor relate*
<p>O <b>limitlessfs</b> foi pensado para ter um uso mais simples possível, sendo assim, com o mínimo de código você já consegue fazer a leitura do seu arquivo.</p>

Exemplo do uso:
```js
const limitlessfs = require('./limitlessfs') // Caminho do arquivo limitlessfs

limitlessfs._config = {
  _true: 'sim',
  _false: 'nao',
  _blocks: [
    /* Configuração das linhas do seu arquivo */
  ]
}

limitlessfs._read('./arquivo.txt') // Caminho do seu arquivo de configuração

// Após o _read() a constante será convertida em um objeto, com os valores que você definiu no "_blocks"
console.log(limitlessfs)

```
> **DICA:** O objeto "**._config**" por vezes, pode ficar extenso dependendo da quantidade de linhas que o seu arquivo de configuração tem. Por esse motivo, é aconselhado, definir toda a configuração do **limitlessfs** em um arquivo separado da sua aplicação para não misturar com o seu código, e depois importá-lo em seu projeto.

Exemplo:
```js
// Arquivo configureLimitlessfs.js

const limitlessfs = require('./limitlessfs')

limitlessfs._config = {
  _true: 'sim',
  _false: 'nao',
  _blocks: [
    /* Configuração das linhas... */
  ]
}

limitlessfs._read('./arquivo.txt')

// Permitindo a exportação...
module.exports = limitlessfs
```
```js
// No seu Projeto...

const limitlessfs = require('./configureLimitlessfs')

// A constante está pronta para ser usada como objeto na sua Aplicação
console.log(limitlessfs)
```
Dessa maneira todas as configurações não ficam juntas da sua aplicação :relaxed:

# Opções do .config = {}
```js
limitlessfs.config = {
  /* Sua opções do config aqui... */
  _blocks: []
}
```
O objeto `.config` é o principal atributo para configurar o **limitlessfs**, é através dele que você tem acesso ao atributo *_blocks* que define a leitura das linhas do seu arquivo, o `.config` também tem várias opções para personalizar a leitura do arquivo, são elas:<br>

* `_separator`: *String ~ Array* | Caractere que separa os atributos dos valores do arquivo. *Default:* `:`<br>
* `_true`: *String ~ Array* | Valor considerado como o **true**. *Default:* `yes`<br>
* `_false`: *String ~ Array* | Valor considerado como o **false**. *Default:* `no`<br>
* `_split`: *String ~ Array* | Caractere que separa os valores de um Array. *Default:* `,`<br>
* `_ignoreCharacter`: *String ~ Array* | Caracteres a serem ignorados e removidos antes da leitura do arquivo.<br>
* `_removeQM`: *Boolean* | Remover todas as "aspas" (simples e duplas) do arquivo antes da leitura. *Default:* `true`<br>
* `_ignoreCaseInSplit`: *Boolean* | Não considera o Case-sensitive nos valores que separam um Array. *Default:* `true`<br>
* `_blocks`: *Array* | **Obrigatório** Configura os parâmetros para a leitura das valores do arquivo.
> <p><em><b>OBS:</b> Salvo o "_blocks", <strong>nenhuma</strong> opção dentro do ".config" é obrigatória.</em></p>

# _blocks: []
O `_blocks` é o responsável por saber como ler o seu arquivo. Ele é um `Array` onde cada *index* é responsável por uma linha do arquivo, e os *index* são preenchidos com um `Objeto` que leva as configurações.
```js
_blocks: [
  {
    line:
    render:
    value:
    require:
    default:
    caseSensitive:  
  },
  ...]
```

> Apenas os atributos `line` e `render` são obrigatórios, o restante das opções são opcionais.
<p><strong>Definição dos atributos:</strong><p>

* `line`: *String ~ Array* | A escrita linha no seu arquivo que leva o(s) valor(es). (Antes do `_separator`)<br>
* `render`: *String* | O nome da linha que será *"renderizado"* no Objeto final.<br>
* `value`: *Property* | Os valores são: `String`, `Number`, `Array`, `Boolean`, `null`. É o tipo do valor a ser atribuido a linha. Caso esse atributo não seja definido, o próprio *limitlessfs* buscará tipo do valor.<br>
* `require`: *Boolean* | Se a linha é obrigatória ou não. *Default:* `true`<br>
* `default`: *Any* | O valor padrão a ser atribuido, caso a linha não tenha sido escrita no arquivo.<br>
* `caseSensitive`: *Boolean* | Se o *limitlessfs* respeitará a diferença entre letras maiúsculas e minúsculas dos valores da linha, e não converterá todos os valores para minúsculo *(padrão)*. *Default:* `false`<br>

> ## Nota Importante sobre o `line`
> Para facilitar a leitura dos atributos das linhas no arquivo, por padrão o **limitlessfs** retira todas as acentuações e cedilha dos atributos e converte tudo para letras minúsculas.
> Sendo assim, passar os parâmentos de uma linha em minúsculo, sem acentuação ou cedilha.

> ## Nota sobre o `require` e `default`
> Pode ocorrer uma situação em que se define uma linha como "require: false" e não passa o valor de "default" para a linha, nesse caso, se a linha não for escrita ou esteja sem valor, o *limitless* atribuirá o valor de `null`

# Mensagens e outras opções

É possível personalizar as mensagens de erros e alertas que aparecem no `console`, você pode acessar as mensagens através do atributo `__msg.<nomeDaMsg>`. O *limitlessfs* possui três mensagens de erro e duas de alerta:
```js
/* Mensagens de Erro: */
limitlessfs.__msg = {
  fileNotFound: 'File "{0}" not found. Check file local',
  lineRequire: 'Line {0} Required!',
  errorLineParam: 'ERROR in param value "{0}", on line: {1}'
}

/* Mensagens de Alerta: */
limitlessfs.__msg = {
  emplyLineParam: 'WARN: Line ({0}) param value: "{1}". Converted for {2}',
  emplyLineParamSetted: 'WARN: Line ({0}) with defined value has a "{1}" parameter. Converted for default value.'
}
```

**IMPORTANTE**: Esteja ciente que os números dentro de chaves `{0}, {1} e {2}` são parâmentos é **não** devem ser removidos, de resto você pode fazem qualquer alteração na string.
```js
// Exemplo, modificando uma mensagem:
limitlessfs.__msg.lineRequire = 'Linha {0} é obrigatória!'
```
## Opções e Valores defaults

Através do atributo `__defaultValues.<nomeDaPropriedade>`, você pode manipular alguns comportamentos padrão do *limitlessfs*, segue toda a lista de propriedades acessíveis do `__defaultValues`:
```js
limitlessfs.__defaultValues = {
  // Valores default do "_config = {}"
  _separator: ':',
  _removeQM: true,
  _ignoreCharacter: '',
  _split: ',',
  _true: 'yes',
  _false: 'no',
  _ignoreCaseInSplit: true,
  
  // Valores default para o tipo do "value" para um linha ausente e que não é obrigatória
  array: [],
  string: '',
  number: 0,
  boolean: false,

  // Valor default para uma linha ausente, sem o atributo "value" definido
  emplyLineParam: null,

  // Padrão de Identificação para uma linha de comentário. (você pode adicionar um Array de valores)
  comment: '>>',

  // Exibir ou ocultar as mensagens de "Alertas" no console.
  hideWarnMsg: false,

  // Tipo de encoder para ler o arquivo de configuração.
  encode: null
}
```
> Exemplo, modificando uma propriedade default:
```js
limitlessfs.__msg.hideWarnMsg = true
```

# Exemplo completo
Veja o exemplo de uma configuração completa de uma aplicação para gerar sequências aleatórias, e o arquivo `.txt` que é possível ler, aplicando essas configurações:<br>

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
const limitlessfs = require('./limitlessfs')

// Personalizar as mensagens de ATENÇÃO e ERRO:
aijr.__msg.fileNotFound = 'Não encontrou o arquivo {0}'
aijr.__msg.lineRequire = 'Coloque a linha "{0}" ai'
aijr.__msg.emplyLineParam = 'ATENÇÃO: A linha ({0}) está "{1}". O valor será convertido para "{2}"'
aijr.__msg.errorLineParam = 'ERRO no valor "{0}", passado como parâmetro da linha: {1}'
aijr.__msg.emplyLineParamSetted = 'AVISO: A linha ({0}) de valor definido está "{1}". O valor será convertido para o "valor padrão".'

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

limitlessfs._read('../configuraV3.txt')
module.exports = limitlessfs
```

Arquivo da Aplicação - `rands.js`:
```js
const config = require('./configLimitlessfs')

console.log(config)
// Resultado no console:
{
  range: [ 1, 31 ],
  sequential: 1,
  fixedNum: [],
  excludeNum: [],
  excludeCombinations: null,
  width: 20,
  total: 100,
  sorted: true,
  norepeat: false,
  filename: 'Loterias',
  openfileFinished: true
}
```