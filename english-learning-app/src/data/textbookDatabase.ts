import { TextbookData, Word } from '../types';

// 北京版小学英语三年级上册词汇库
export const beijingGrade3Volume1: TextbookData = {
  info: {
    id: 'beijing-grade3-vol1',
    name: '北京版小学英语三年级上册',
    publisher: '北京出版社',
    grade: '三年级',
    semester: '上册',
    region: '北京市',
    description: '适用于北京市小学三年级学生的英语教材'
  },
  units: [
    {
      id: 'unit1',
      name: 'Unit 1 - Hello',
      description: '问候与自我介绍',
      lessons: [
        {
          id: 'lesson1',
          name: 'Lesson 1 - Greetings',
          description: '基本问候用语',
          words: [
            { id: 'bj3-1-1', english: 'hello', chinese: '你好', pronunciation: 'həˈloʊ', level: 'beginner', category: 'greeting', textbook: 'beijing-grade3-vol1', unit: 'unit1', lesson: 'lesson1' },
            { id: 'bj3-1-2', english: 'hi', chinese: '嗨', pronunciation: 'haɪ', level: 'beginner', category: 'greeting', textbook: 'beijing-grade3-vol1', unit: 'unit1', lesson: 'lesson1' },
            { id: 'bj3-1-3', english: 'good', chinese: '好的', pronunciation: 'ɡʊd', level: 'beginner', category: 'adjective', textbook: 'beijing-grade3-vol1', unit: 'unit1', lesson: 'lesson1' },
            { id: 'bj3-1-4', english: 'morning', chinese: '早晨', pronunciation: 'ˈmɔːrnɪŋ', level: 'beginner', category: 'time', textbook: 'beijing-grade3-vol1', unit: 'unit1', lesson: 'lesson1' },
            { id: 'bj3-1-5', english: 'afternoon', chinese: '下午', pronunciation: 'ˌæftərˈnuːn', level: 'beginner', category: 'time', textbook: 'beijing-grade3-vol1', unit: 'unit1', lesson: 'lesson1' },
          ]
        },
        {
          id: 'lesson2',
          name: 'Lesson 2 - My Name',
          description: '介绍姓名',
          words: [
            { id: 'bj3-1-6', english: 'name', chinese: '名字', pronunciation: 'neɪm', level: 'beginner', category: 'noun', textbook: 'beijing-grade3-vol1', unit: 'unit1', lesson: 'lesson2' },
            { id: 'bj3-1-7', english: 'my', chinese: '我的', pronunciation: 'maɪ', level: 'beginner', category: 'pronoun', textbook: 'beijing-grade3-vol1', unit: 'unit1', lesson: 'lesson2' },
            { id: 'bj3-1-8', english: 'your', chinese: '你的', pronunciation: 'jʊr', level: 'beginner', category: 'pronoun', textbook: 'beijing-grade3-vol1', unit: 'unit1', lesson: 'lesson2' },
            { id: 'bj3-1-9', english: 'I', chinese: '我', pronunciation: 'aɪ', level: 'beginner', category: 'pronoun', textbook: 'beijing-grade3-vol1', unit: 'unit1', lesson: 'lesson2' },
            { id: 'bj3-1-10', english: 'you', chinese: '你', pronunciation: 'juː', level: 'beginner', category: 'pronoun', textbook: 'beijing-grade3-vol1', unit: 'unit1', lesson: 'lesson2' },
          ]
        }
      ]
    },
    {
      id: 'unit2',
      name: 'Unit 2 - Family',
      description: '家庭成员',
      lessons: [
        {
          id: 'lesson3',
          name: 'Lesson 3 - Family Members',
          description: '家庭成员介绍',
          words: [
            { id: 'bj3-2-1', english: 'family', chinese: '家庭', pronunciation: 'ˈfæməli', level: 'beginner', category: 'noun', textbook: 'beijing-grade3-vol1', unit: 'unit2', lesson: 'lesson3' },
            { id: 'bj3-2-2', english: 'father', chinese: '爸爸', pronunciation: 'ˈfɑːðər', level: 'beginner', category: 'family', textbook: 'beijing-grade3-vol1', unit: 'unit2', lesson: 'lesson3' },
            { id: 'bj3-2-3', english: 'mother', chinese: '妈妈', pronunciation: 'ˈmʌðər', level: 'beginner', category: 'family', textbook: 'beijing-grade3-vol1', unit: 'unit2', lesson: 'lesson3' },
            { id: 'bj3-2-4', english: 'brother', chinese: '哥哥/弟弟', pronunciation: 'ˈbrʌðər', level: 'beginner', category: 'family', textbook: 'beijing-grade3-vol1', unit: 'unit2', lesson: 'lesson3' },
            { id: 'bj3-2-5', english: 'sister', chinese: '姐姐/妹妹', pronunciation: 'ˈsɪstər', level: 'beginner', category: 'family', textbook: 'beijing-grade3-vol1', unit: 'unit2', lesson: 'lesson3' },
          ]
        },
        {
          id: 'lesson4',
          name: 'Lesson 4 - This is...',
          description: '介绍他人',
          words: [
            { id: 'bj3-2-6', english: 'this', chinese: '这个', pronunciation: 'ðɪs', level: 'beginner', category: 'pronoun', textbook: 'beijing-grade3-vol1', unit: 'unit2', lesson: 'lesson4' },
            { id: 'bj3-2-7', english: 'is', chinese: '是', pronunciation: 'ɪz', level: 'beginner', category: 'verb', textbook: 'beijing-grade3-vol1', unit: 'unit2', lesson: 'lesson4' },
            { id: 'bj3-2-8', english: 'he', chinese: '他', pronunciation: 'hiː', level: 'beginner', category: 'pronoun', textbook: 'beijing-grade3-vol1', unit: 'unit2', lesson: 'lesson4' },
            { id: 'bj3-2-9', english: 'she', chinese: '她', pronunciation: 'ʃiː', level: 'beginner', category: 'pronoun', textbook: 'beijing-grade3-vol1', unit: 'unit2', lesson: 'lesson4' },
            { id: 'bj3-2-10', english: 'nice', chinese: '好的，美好的', pronunciation: 'naɪs', level: 'beginner', category: 'adjective', textbook: 'beijing-grade3-vol1', unit: 'unit2', lesson: 'lesson4' },
          ]
        }
      ]
    },
    {
      id: 'unit3',
      name: 'Unit 3 - Colors',
      description: '颜色',
      lessons: [
        {
          id: 'lesson5',
          name: 'Lesson 5 - Basic Colors',
          description: '基本颜色',
          words: [
            { id: 'bj3-3-1', english: 'red', chinese: '红色', pronunciation: 'red', level: 'beginner', category: 'color', textbook: 'beijing-grade3-vol1', unit: 'unit3', lesson: 'lesson5' },
            { id: 'bj3-3-2', english: 'blue', chinese: '蓝色', pronunciation: 'bluː', level: 'beginner', category: 'color', textbook: 'beijing-grade3-vol1', unit: 'unit3', lesson: 'lesson5' },
            { id: 'bj3-3-3', english: 'yellow', chinese: '黄色', pronunciation: 'ˈjeloʊ', level: 'beginner', category: 'color', textbook: 'beijing-grade3-vol1', unit: 'unit3', lesson: 'lesson5' },
            { id: 'bj3-3-4', english: 'green', chinese: '绿色', pronunciation: 'ɡriːn', level: 'beginner', category: 'color', textbook: 'beijing-grade3-vol1', unit: 'unit3', lesson: 'lesson5' },
            { id: 'bj3-3-5', english: 'black', chinese: '黑色', pronunciation: 'blæk', level: 'beginner', category: 'color', textbook: 'beijing-grade3-vol1', unit: 'unit3', lesson: 'lesson5' },
            { id: 'bj3-3-6', english: 'white', chinese: '白色', pronunciation: 'waɪt', level: 'beginner', category: 'color', textbook: 'beijing-grade3-vol1', unit: 'unit3', lesson: 'lesson5' },
          ]
        },
        {
          id: 'lesson6',
          name: 'Lesson 6 - What Color',
          description: '询问颜色',
          words: [
            { id: 'bj3-3-7', english: 'what', chinese: '什么', pronunciation: 'wʌt', level: 'beginner', category: 'question', textbook: 'beijing-grade3-vol1', unit: 'unit3', lesson: 'lesson6' },
            { id: 'bj3-3-8', english: 'color', chinese: '颜色', pronunciation: 'ˈkʌlər', level: 'beginner', category: 'noun', textbook: 'beijing-grade3-vol1', unit: 'unit3', lesson: 'lesson6' },
            { id: 'bj3-3-9', english: 'it', chinese: '它', pronunciation: 'ɪt', level: 'beginner', category: 'pronoun', textbook: 'beijing-grade3-vol1', unit: 'unit3', lesson: 'lesson6' },
            { id: 'bj3-3-10', english: 'orange', chinese: '橙色', pronunciation: 'ˈɔːrɪndʒ', level: 'beginner', category: 'color', textbook: 'beijing-grade3-vol1', unit: 'unit3', lesson: 'lesson6' },
            { id: 'bj3-3-11', english: 'purple', chinese: '紫色', pronunciation: 'ˈpɜːrpl', level: 'beginner', category: 'color', textbook: 'beijing-grade3-vol1', unit: 'unit3', lesson: 'lesson6' },
          ]
        }
      ]
    },
    {
      id: 'unit4',
      name: 'Unit 4 - Numbers',
      description: '数字',
      lessons: [
        {
          id: 'lesson7',
          name: 'Lesson 7 - Numbers 1-10',
          description: '数字1-10',
          words: [
            { id: 'bj3-4-1', english: 'one', chinese: '一', pronunciation: 'wʌn', level: 'beginner', category: 'number', textbook: 'beijing-grade3-vol1', unit: 'unit4', lesson: 'lesson7' },
            { id: 'bj3-4-2', english: 'two', chinese: '二', pronunciation: 'tuː', level: 'beginner', category: 'number', textbook: 'beijing-grade3-vol1', unit: 'unit4', lesson: 'lesson7' },
            { id: 'bj3-4-3', english: 'three', chinese: '三', pronunciation: 'θriː', level: 'beginner', category: 'number', textbook: 'beijing-grade3-vol1', unit: 'unit4', lesson: 'lesson7' },
            { id: 'bj3-4-4', english: 'four', chinese: '四', pronunciation: 'fɔːr', level: 'beginner', category: 'number', textbook: 'beijing-grade3-vol1', unit: 'unit4', lesson: 'lesson7' },
            { id: 'bj3-4-5', english: 'five', chinese: '五', pronunciation: 'faɪv', level: 'beginner', category: 'number', textbook: 'beijing-grade3-vol1', unit: 'unit4', lesson: 'lesson7' },
            { id: 'bj3-4-6', english: 'six', chinese: '六', pronunciation: 'sɪks', level: 'beginner', category: 'number', textbook: 'beijing-grade3-vol1', unit: 'unit4', lesson: 'lesson7' },
            { id: 'bj3-4-7', english: 'seven', chinese: '七', pronunciation: 'ˈsevn', level: 'beginner', category: 'number', textbook: 'beijing-grade3-vol1', unit: 'unit4', lesson: 'lesson7' },
            { id: 'bj3-4-8', english: 'eight', chinese: '八', pronunciation: 'eɪt', level: 'beginner', category: 'number', textbook: 'beijing-grade3-vol1', unit: 'unit4', lesson: 'lesson7' },
            { id: 'bj3-4-9', english: 'nine', chinese: '九', pronunciation: 'naɪn', level: 'beginner', category: 'number', textbook: 'beijing-grade3-vol1', unit: 'unit4', lesson: 'lesson7' },
            { id: 'bj3-4-10', english: 'ten', chinese: '十', pronunciation: 'ten', level: 'beginner', category: 'number', textbook: 'beijing-grade3-vol1', unit: 'unit4', lesson: 'lesson7' },
          ]
        },
        {
          id: 'lesson8',
          name: 'Lesson 8 - How Many',
          description: '询问数量',
          words: [
            { id: 'bj3-4-11', english: 'how', chinese: '怎么', pronunciation: 'haʊ', level: 'beginner', category: 'question', textbook: 'beijing-grade3-vol1', unit: 'unit4', lesson: 'lesson8' },
            { id: 'bj3-4-12', english: 'many', chinese: '许多', pronunciation: 'ˈmeni', level: 'beginner', category: 'adjective', textbook: 'beijing-grade3-vol1', unit: 'unit4', lesson: 'lesson8' },
            { id: 'bj3-4-13', english: 'book', chinese: '书', pronunciation: 'bʊk', level: 'beginner', category: 'object', textbook: 'beijing-grade3-vol1', unit: 'unit4', lesson: 'lesson8' },
            { id: 'bj3-4-14', english: 'pen', chinese: '钢笔', pronunciation: 'pen', level: 'beginner', category: 'object', textbook: 'beijing-grade3-vol1', unit: 'unit4', lesson: 'lesson8' },
            { id: 'bj3-4-15', english: 'pencil', chinese: '铅笔', pronunciation: 'ˈpensl', level: 'beginner', category: 'object', textbook: 'beijing-grade3-vol1', unit: 'unit4', lesson: 'lesson8' },
          ]
        }
      ]
    },
    {
      id: 'unit5',
      name: 'Unit 5 - Animals',
      description: '动物',
      lessons: [
        {
          id: 'lesson9',
          name: 'Lesson 9 - Pet Animals',
          description: '宠物动物',
          words: [
            { id: 'bj3-5-1', english: 'cat', chinese: '猫', pronunciation: 'kæt', level: 'beginner', category: 'animal', textbook: 'beijing-grade3-vol1', unit: 'unit5', lesson: 'lesson9' },
            { id: 'bj3-5-2', english: 'dog', chinese: '狗', pronunciation: 'dɔːɡ', level: 'beginner', category: 'animal', textbook: 'beijing-grade3-vol1', unit: 'unit5', lesson: 'lesson9' },
            { id: 'bj3-5-3', english: 'bird', chinese: '鸟', pronunciation: 'bɜːrd', level: 'beginner', category: 'animal', textbook: 'beijing-grade3-vol1', unit: 'unit5', lesson: 'lesson9' },
            { id: 'bj3-5-4', english: 'fish', chinese: '鱼', pronunciation: 'fɪʃ', level: 'beginner', category: 'animal', textbook: 'beijing-grade3-vol1', unit: 'unit5', lesson: 'lesson9' },
            { id: 'bj3-5-5', english: 'rabbit', chinese: '兔子', pronunciation: 'ˈræbɪt', level: 'beginner', category: 'animal', textbook: 'beijing-grade3-vol1', unit: 'unit5', lesson: 'lesson9' },
          ]
        },
        {
          id: 'lesson10',
          name: 'Lesson 10 - Farm Animals',
          description: '农场动物',
          words: [
            { id: 'bj3-5-6', english: 'cow', chinese: '奶牛', pronunciation: 'kaʊ', level: 'beginner', category: 'animal', textbook: 'beijing-grade3-vol1', unit: 'unit5', lesson: 'lesson10' },
            { id: 'bj3-5-7', english: 'pig', chinese: '猪', pronunciation: 'pɪɡ', level: 'beginner', category: 'animal', textbook: 'beijing-grade3-vol1', unit: 'unit5', lesson: 'lesson10' },
            { id: 'bj3-5-8', english: 'duck', chinese: '鸭子', pronunciation: 'dʌk', level: 'beginner', category: 'animal', textbook: 'beijing-grade3-vol1', unit: 'unit5', lesson: 'lesson10' },
            { id: 'bj3-5-9', english: 'chicken', chinese: '鸡', pronunciation: 'ˈtʃɪkɪn', level: 'beginner', category: 'animal', textbook: 'beijing-grade3-vol1', unit: 'unit5', lesson: 'lesson10' },
            { id: 'bj3-5-10', english: 'horse', chinese: '马', pronunciation: 'hɔːrs', level: 'beginner', category: 'animal', textbook: 'beijing-grade3-vol1', unit: 'unit5', lesson: 'lesson10' },
          ]
        }
      ]
    },
    {
      id: 'unit6',
      name: 'Unit 6 - Food',
      description: '食物',
      lessons: [
        {
          id: 'lesson11',
          name: 'Lesson 11 - Fruits',
          description: '水果',
          words: [
            { id: 'bj3-6-1', english: 'apple', chinese: '苹果', pronunciation: 'ˈæpl', level: 'beginner', category: 'fruit', textbook: 'beijing-grade3-vol1', unit: 'unit6', lesson: 'lesson11' },
            { id: 'bj3-6-2', english: 'banana', chinese: '香蕉', pronunciation: 'bəˈnænə', level: 'beginner', category: 'fruit', textbook: 'beijing-grade3-vol1', unit: 'unit6', lesson: 'lesson11' },
            { id: 'bj3-6-3', english: 'orange', chinese: '橙子', pronunciation: 'ˈɔːrɪndʒ', level: 'beginner', category: 'fruit', textbook: 'beijing-grade3-vol1', unit: 'unit6', lesson: 'lesson11' },
            { id: 'bj3-6-4', english: 'grape', chinese: '葡萄', pronunciation: 'ɡreɪp', level: 'beginner', category: 'fruit', textbook: 'beijing-grade3-vol1', unit: 'unit6', lesson: 'lesson11' },
            { id: 'bj3-6-5', english: 'pear', chinese: '梨', pronunciation: 'per', level: 'beginner', category: 'fruit', textbook: 'beijing-grade3-vol1', unit: 'unit6', lesson: 'lesson11' },
          ]
        },
        {
          id: 'lesson12',
          name: 'Lesson 12 - I Like...',
          description: '表达喜好',
          words: [
            { id: 'bj3-6-6', english: 'like', chinese: '喜欢', pronunciation: 'laɪk', level: 'beginner', category: 'verb', textbook: 'beijing-grade3-vol1', unit: 'unit6', lesson: 'lesson12' },
            { id: 'bj3-6-7', english: 'do', chinese: '做', pronunciation: 'duː', level: 'beginner', category: 'verb', textbook: 'beijing-grade3-vol1', unit: 'unit6', lesson: 'lesson12' },
            { id: 'bj3-6-8', english: 'not', chinese: '不', pronunciation: 'nɑːt', level: 'beginner', category: 'adverb', textbook: 'beijing-grade3-vol1', unit: 'unit6', lesson: 'lesson12' },
            { id: 'bj3-6-9', english: 'milk', chinese: '牛奶', pronunciation: 'mɪlk', level: 'beginner', category: 'drink', textbook: 'beijing-grade3-vol1', unit: 'unit6', lesson: 'lesson12' },
            { id: 'bj3-6-10', english: 'water', chinese: '水', pronunciation: 'ˈwɔːtər', level: 'beginner', category: 'drink', textbook: 'beijing-grade3-vol1', unit: 'unit6', lesson: 'lesson12' },
          ]
        }
      ]
    }
  ]
};

// 人教版小学英语三年级上册词汇库
export const peopleEducationGrade3Volume1: TextbookData = {
  info: {
    id: 'people-education-grade3-vol1',
    name: '人教版小学英语三年级上册',
    publisher: '人民教育出版社',
    grade: '三年级',
    semester: '上册',
    region: '全国通用',
    description: '适用于全国大部分地区小学三年级学生的英语教材'
  },
  units: [
    {
      id: 'unit1',
      name: 'Unit 1 - Hello!',
      description: '问候语和自我介绍',
      lessons: [
        {
          id: 'lesson1',
          name: 'Part A - Let\'s talk',
          description: '基本问候对话',
          words: [
            { id: 'pep3-1-1', english: 'hello', chinese: '你好', pronunciation: 'həˈloʊ', level: 'beginner', category: 'greeting', textbook: 'people-education-grade3-vol1', unit: 'unit1', lesson: 'lesson1' },
            { id: 'pep3-1-2', english: 'hi', chinese: '嗨', pronunciation: 'haɪ', level: 'beginner', category: 'greeting', textbook: 'people-education-grade3-vol1', unit: 'unit1', lesson: 'lesson1' },
            { id: 'pep3-1-3', english: 'goodbye', chinese: '再见', pronunciation: 'ɡʊdˈbaɪ', level: 'beginner', category: 'greeting', textbook: 'people-education-grade3-vol1', unit: 'unit1', lesson: 'lesson1' },
            { id: 'pep3-1-4', english: 'bye', chinese: '再见', pronunciation: 'baɪ', level: 'beginner', category: 'greeting', textbook: 'people-education-grade3-vol1', unit: 'unit1', lesson: 'lesson1' },
          ]
        },
        {
          id: 'lesson2',
          name: 'Part B - Let\'s learn',
          description: '学习单词',
          words: [
            { id: 'pep3-1-5', english: 'crayon', chinese: '蜡笔', pronunciation: 'ˈkreɪən', level: 'beginner', category: 'school', textbook: 'people-education-grade3-vol1', unit: 'unit1', lesson: 'lesson2' },
            { id: 'pep3-1-6', english: 'pencil', chinese: '铅笔', pronunciation: 'ˈpensl', level: 'beginner', category: 'school', textbook: 'people-education-grade3-vol1', unit: 'unit1', lesson: 'lesson2' },
            { id: 'pep3-1-7', english: 'pen', chinese: '钢笔', pronunciation: 'pen', level: 'beginner', category: 'school', textbook: 'people-education-grade3-vol1', unit: 'unit1', lesson: 'lesson2' },
            { id: 'pep3-1-8', english: 'eraser', chinese: '橡皮', pronunciation: 'ɪˈreɪsər', level: 'beginner', category: 'school', textbook: 'people-education-grade3-vol1', unit: 'unit1', lesson: 'lesson2' },
            { id: 'pep3-1-9', english: 'ruler', chinese: '尺子', pronunciation: 'ˈruːlər', level: 'beginner', category: 'school', textbook: 'people-education-grade3-vol1', unit: 'unit1', lesson: 'lesson2' },
          ]
        }
      ]
    },
    {
      id: 'unit2',
      name: 'Unit 2 - Colours',
      description: '颜色',
      lessons: [
        {
          id: 'lesson1',
          name: 'Part A - Let\'s talk',
          description: '颜色对话',
          words: [
            { id: 'pep3-2-1', english: 'red', chinese: '红色', pronunciation: 'red', level: 'beginner', category: 'color', textbook: 'people-education-grade3-vol1', unit: 'unit2', lesson: 'lesson1' },
            { id: 'pep3-2-2', english: 'green', chinese: '绿色', pronunciation: 'ɡriːn', level: 'beginner', category: 'color', textbook: 'people-education-grade3-vol1', unit: 'unit2', lesson: 'lesson1' },
            { id: 'pep3-2-3', english: 'yellow', chinese: '黄色', pronunciation: 'ˈjeloʊ', level: 'beginner', category: 'color', textbook: 'people-education-grade3-vol1', unit: 'unit2', lesson: 'lesson1' },
            { id: 'pep3-2-4', english: 'blue', chinese: '蓝色', pronunciation: 'bluː', level: 'beginner', category: 'color', textbook: 'people-education-grade3-vol1', unit: 'unit2', lesson: 'lesson1' },
          ]
        },
        {
          id: 'lesson2',
          name: 'Part B - Let\'s learn',
          description: '更多颜色',
          words: [
            { id: 'pep3-2-5', english: 'black', chinese: '黑色', pronunciation: 'blæk', level: 'beginner', category: 'color', textbook: 'people-education-grade3-vol1', unit: 'unit2', lesson: 'lesson2' },
            { id: 'pep3-2-6', english: 'brown', chinese: '棕色', pronunciation: 'braʊn', level: 'beginner', category: 'color', textbook: 'people-education-grade3-vol1', unit: 'unit2', lesson: 'lesson2' },
            { id: 'pep3-2-7', english: 'white', chinese: '白色', pronunciation: 'waɪt', level: 'beginner', category: 'color', textbook: 'people-education-grade3-vol1', unit: 'unit2', lesson: 'lesson2' },
            { id: 'pep3-2-8', english: 'orange', chinese: '橙色', pronunciation: 'ˈɔːrɪndʒ', level: 'beginner', category: 'color', textbook: 'people-education-grade3-vol1', unit: 'unit2', lesson: 'lesson2' },
          ]
        }
      ]
    }
  ]
};

// 教材数据库
export const textbookDatabase: Record<string, TextbookData> = {
  'beijing-grade3-vol1': beijingGrade3Volume1,
  'people-education-grade3-vol1': peopleEducationGrade3Volume1,
  // 可以在这里添加更多教材版本
};

// 动态添加PDF导入的教材
export function addPDFTextbook(textbook: TextbookData) {
  textbookDatabase[textbook.info.id] = textbook;
}

// 获取所有可用的教材
export function getAvailableTextbooks(): TextbookData[] {
  return Object.values(textbookDatabase);
}

// 根据教材ID获取教材数据
export function getTextbookById(id: string): TextbookData | undefined {
  return textbookDatabase[id];
}

// 获取指定教材的所有单词
export function getAllWordsFromTextbook(textbookId: string): Word[] {
  const textbook = textbookDatabase[textbookId];
  if (!textbook) return [];
  
  const words: Word[] = [];
  textbook.units.forEach(unit => {
    unit.lessons.forEach(lesson => {
      words.push(...lesson.words);
    });
  });
  
  return words;
}

// 获取指定单元的单词
export function getWordsFromUnit(textbookId: string, unitId: string): Word[] {
  const textbook = textbookDatabase[textbookId];
  if (!textbook) return [];
  
  const unit = textbook.units.find(u => u.id === unitId);
  if (!unit) return [];
  
  const words: Word[] = [];
  unit.lessons.forEach(lesson => {
    words.push(...lesson.words);
  });
  
  return words;
}

// 获取指定课程的单词
export function getWordsFromLesson(textbookId: string, unitId: string, lessonId: string): Word[] {
  const textbook = textbookDatabase[textbookId];
  if (!textbook) return [];
  
  const unit = textbook.units.find(u => u.id === unitId);
  if (!unit) return [];
  
  const lesson = unit.lessons.find(l => l.id === lessonId);
  if (!lesson) return [];
  
  return lesson.words;
} 