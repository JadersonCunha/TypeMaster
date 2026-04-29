import { Level, LevelDifficulty } from '../types';

export const LEVELS: Level[] = [
  {
    id: 1,
    title: "Fundamentos da Linha Base",
    difficulty: LevelDifficulty.BEGINNER,
    tips: [
      "Mantenha seus dedos suavemente sobre as teclas ASDF e JKL;.",
      "Use os polegares exclusivamente para a barra de espaço.",
      "Não olhe para o teclado; tente sentir as marcações nas teclas F e J.",
      "Mantenha uma postura ereta para evitar fadiga nos ombros."
    ],
    challenges: [
      {
        id: "L1-C1",
        title: "Posicionamento Básico",
        description: "Pratique as teclas da linha central.",
        content: "asdf jkl; asdf jkl; fada sala asada fala jaja fafa",
        minWpm: 15,
        minAccuracy: 90
      },
      {
        id: "L1-C2",
        title: "Padrões da Linha Base",
        description: "Sequências comuns usando apenas a linha central.",
        content: "salada salsicha asada falas fada dadas aladas galas",
        minWpm: 20,
        minAccuracy: 95
      }
    ]
  },
  {
    id: 2,
    title: "Expansão para Linha Superior",
    difficulty: LevelDifficulty.BEGINNER,
    tips: [
      "Suba o dedo, clique e volte imediatamente para a base.",
      "Mantenha os pulsos retos e elevados, não os apoie na mesa.",
      "Imagine um fio puxando o topo da sua cabeça para manter o pescoço alinhado."
    ],
    challenges: [
      {
        id: "L2-C1",
        title: "Linha Superior",
        description: "Introduzindo as teclas QWE e RTY.",
        content: "querer terra trair parte preto quarto queijo roteiro",
        minWpm: 20,
        minAccuracy: 90
      },
      {
        id: "L2-C2",
        title: "Integração Superior",
        description: "Palavras combinando linha base e superior.",
        content: "água vida porta sorte forte norte ponte fonte mente",
        minWpm: 25,
        minAccuracy: 95
      }
    ]
  },
  {
    id: 3,
    title: "Conquista da Linha Inferior",
    difficulty: LevelDifficulty.INTERMEDIATE,
    tips: [
      "As teclas inferiores exigem um movimento de recuo dos dedos.",
      "Mantenha a calma; a precisão é mais importante que a velocidade no início.",
      "Respire fundo e mantenha o ritmo; a fluidez vem com o relaxamento."
    ],
    challenges: [
      {
        id: "L3-C1",
        title: "Movimentos Descendentes",
        description: "Foco nas teclas ZXCV e BNM.",
        content: "zebra caixa barco navio mundo carro voar baixo",
        minWpm: 25,
        minAccuracy: 90
      },
      {
        id: "L3-C2",
        title: "Fluidez Total",
        description: "Palavras que utilizam todas as linhas do teclado.",
        content: "o rato roeu a roupa do rei de roma rapidamente hoje",
        minWpm: 30,
        minAccuracy: 95
      }
    ]
  },
  {
    id: 4,
    title: "O Desafio da Pontuação",
    difficulty: LevelDifficulty.INTERMEDIATE,
    tips: [
      "Use a tecla Shift oposta à mão que está digitando a letra.",
      "Símbolos aumentam sua utilidade profissional.",
      "Pratique o uso do Shift sem olhar, sentindo a posição dos dedos mindinhos."
    ],
    challenges: [
      {
        id: "L4-C1",
        title: "Sentenças Estruturadas",
        description: "Uso de maiúsculas e pontos finais.",
        content: "O sucesso é a soma de pequenos esforços repetidos.",
        minWpm: 35,
        minAccuracy: 95
      },
      {
        id: "L4-C2",
        title: "Listas e Simbolismo",
        description: "Uso de vírgulas e aspas.",
        content: "Lembre-se: \"Prática leva à perfeição\", dia após dia.",
        minWpm: 35,
        minAccuracy: 92
      }
    ]
  },
  {
    id: 5,
    title: "Sintaxe de Código",
    difficulty: LevelDifficulty.ADVANCED,
    tips: [
      "Para programadores, símbolos como { } [ ] / \\ são fundamentais.",
      "Mantenha o ritmo constante mesmo em caracteres especiais.",
      "Foque na geometria do teclado: cada tecla especial tem um 'vizinho' de referência."
    ],
    challenges: [
      {
        id: "L5-C1",
        title: "Lógica de Programação",
        description: "Sintaxe comum em JavaScript.",
        content: "if (velocidade > 50) { console.log(\"Excelente!\"); }",
        minWpm: 40,
        minAccuracy: 98
      },
      {
        id: "L5-C2",
        title: "Estruturas de Dados",
        description: "Arrays e Objetos JSON.",
        content: "const usuario = { nome: \"Dev\", nivel: \"Senior\" };",
        minWpm: 45,
        minAccuracy: 98
      }
    ]
  },
  {
    id: 6,
    title: "Especialização por Linha",
    difficulty: LevelDifficulty.INTERMEDIATE,
    tips: [
      "Isolando o movimento em uma única linha, você fortalece o alcance lateral.",
      "Tente não mover o pulso, apenas os dedos para alcançar as extremidades da linha.",
      "Este exercício é excelente para mapear mentalmente a 'geografia' de cada nível do teclado."
    ],
    challenges: [
      {
        id: "L6-C1",
        title: "Somente Linha Superior",
        description: "Palavras formadas apenas com Q, W, E, R, T, Y, U, I, O, P.",
        content: "topo porto que eu rio rei teu tipo rir power preto",
        minWpm: 30,
        minAccuracy: 95
      },
      {
        id: "L6-C2",
        title: "Somente Linha Central",
        description: "Palavras formadas apenas com A, S, D, F, G, H, J, K, L.",
        content: "asada fala dada fada gala sala salada falas dadas",
        minWpm: 35,
        minAccuracy: 95
      }
    ]
  }
];
