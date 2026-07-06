const letterContent = [
  { type: 'urdu', lines: [
    "تحریم آج کے دن اللہ نے میری خوشیاں زمیں پہ اتاری، آج کے دن رقص کرتی ہوئی ہواؤں نے بتایا تمہارا ہمسفر مل گیا ہے۔ تمہیں آج جنم دن ہے میری شہزادی کا، آج چاند کو زمیں پہ اتارا گیا۔"
  ]},
  { type: 'urdu', lines: [
    "✨ یہ بے خودی، یہ لبوں کی ہنسی مبارک ہو",
    "تمہیں یہ سالگرہ کی خوشی مبارک ہو",
    "تمہاری ہنستی ہوئی زندگی کی راہوں میں",
    "ہزاروں پھول لٹاتی ہوئی بہار آئے",
    "حسین چہرے کی تابندگی مبارک ہو",
    "تمہیں یہ سالگرہ کی خوشی مبارک ہو"
  ]},
  { type: 'roman', lines: [
    "Aj apka din hai, you know, or apsy mera har din hai meri duniya.",
    "Ap bahaar hn meri zindagi ki.",
    "HAPPY BIRTHDAY MY LOVE 💕😘🍰🎂"
  ]},
  { type: 'urdu', lines: [
    "جس جگہ قدم رکھیں وہ جہاں مبارک ہو",
    "ایک حسیں پنچھی کو آسمان مبارک ہو",
    "ساری خوشیاں مل جائے جن پر آپ کا حق ہو",
    "اے میرے پسندیدہ شخص، آپ کو جنم دن مبارک ہو"
  ]},
  { type: 'roman', lines: [
    "Happy Birthday to the most special person of my life."
  ]},
  { type: 'urdu', lines: [
    "میری ہر دعا آپ کے لیے ہے، میری زندگی آپ ہیں۔ میرے لبوں کی مسکراہٹ آپ ہیں، میری آنکھوں کا نور آپ ہیں، میرا وجود آپ ہیں۔ میں بہت شکر گزار ہوں آپ کا، میری زندگی میں آنے کے لیے۔ آپ نے میری زندگی کو اجالوں سے بھر دیا۔"
  ]},
  { type: 'roman', lines: [
    "Happy Birthday My Love",
    "Happy Birthday My Soulmate",
    "Happy Birthday My Wife",
    "Happy birthday, happy birthday",
    "Happy birthday, happy birthday",
    "God bless you, my world, my everything.",
    "I feel so lucky to have you in my life.",
    "I love you so much, meri shehzadi, mery jigar ka tukra, meri qul kainaat, meri sukoon.",
    "Ma hamesha apk sath rehna chahta hu, meri piyari c jaan, love youuu moreee meri sohni c jaan.",
    "Your smile is my favorite chapter, your birthday is my favorite day.",
    "Allah pak apko meri umer laga dy, har zoo saal hum sath jiyen, hamary rishty ko Allah pak har dukh, pareshani sy mehfooz rakhy.",
    "Happy birthday meri jaan.",
    "I LOVE YOU SOO MUCH MERI DUNIYA.",
    "Happy Birthday to the Queen of my 💜❤️"
  ]},
  { type: 'urdu', lines: [
    "\" اگر مجھ سے سب کچھ لے لیا جائے، اور بدلے میں تمہارا ہاتھ میرے ہاتھ میں دے دیا جائے، تو میں ایسی امیری کو ہزار بار قبول کر لوں۔ \" 🌸♥️"
  ]}
];

const signatureText = "With all my love, forever yours 💕";

const WORD_DELAY = 55;
const LINE_PAUSE = 220;
const PARA_PAUSE = 420;

let letterOpened = false;
let typewriterRunning = false;

function startLetterTypewriter(container) {
  if (typewriterRunning) return;
  typewriterRunning = true;

  container.innerHTML = '<span class="letter-heart-top">♥</span>';

  let paraIndex = 0, lineIndex = 0, wordIndex = 0;
  let currentP = null;
  let currentLineSpan = null;
  const caret = document.createElement('span');
  caret.className = 'type-caret';

  function scrollToBottom() {
    container.scrollTop = container.scrollHeight;
  }

  function typeNextWord() {
    if (paraIndex >= letterContent.length) {
      if (caret.parentNode) caret.parentNode.removeChild(caret);
      const sig = document.createElement('p');
      sig.className = 'signature';
      sig.textContent = signatureText;
      container.appendChild(sig);
      scrollToBottom();
      typewriterRunning = false;
      // Dispatch event for finale
      container.dispatchEvent(new CustomEvent('letterDone'));
      return;
    }

    const para = letterContent[paraIndex];
    const lines = para.lines;

    if (lineIndex === 0 && wordIndex === 0 && !currentP) {
      currentP = document.createElement('p');
      currentP.className = para.type;
      container.appendChild(currentP);
      if (para.type === 'roman' && lines.length > 1) {
        currentLineSpan = document.createElement('span');
        currentP.appendChild(currentLineSpan);
      } else {
        currentLineSpan = null;
      }
    }

    const line = lines[lineIndex];
    const words = line.split(' ');
    const word = words[wordIndex];

    const target = currentLineSpan || currentP;
    const textNode = document.createTextNode((wordIndex === 0 ? '' : ' ') + word);
    target.appendChild(textNode);

    if (caret.parentNode) caret.parentNode.removeChild(caret);
    currentP.appendChild(caret);
    scrollToBottom();
    wordIndex++;

    let delay = WORD_DELAY;

    if (wordIndex >= words.length) {
      wordIndex = 0;
      lineIndex++;
      if (caret.parentNode) caret.parentNode.removeChild(caret);
      if (lineIndex < lines.length) {
        if (para.type === 'urdu') {
          currentP.appendChild(document.createElement('br'));
        } else if (para.type === 'roman') {
          currentLineSpan = document.createElement('span');
          currentP.appendChild(currentLineSpan);
        }
        currentP.appendChild(caret);
        delay += LINE_PAUSE;
      } else {
        lineIndex = 0;
        paraIndex++;
        currentP = null;
        currentLineSpan = null;
        delay += PARA_PAUSE;
      }
    }

    setTimeout(typeNextWord, delay);
  }

  typeNextWord();
}

function fastForwardLetter(container) {
  if (!letterOpened) return;
  container.innerHTML = '<span class="letter-heart-top">♥</span>';
  letterContent.forEach(para => {
    const p = document.createElement('p');
    p.className = para.type;
    if (para.type === 'urdu') {
      p.innerHTML = para.lines.join('<br>');
    } else {
      para.lines.forEach(line => {
        const span = document.createElement('span');
        span.textContent = line;
        p.appendChild(span);
      });
    }
    container.appendChild(p);
  });
  const sig = document.createElement('p');
  sig.className = 'signature';
  sig.style.opacity = '1';
  sig.textContent = signatureText;
  container.appendChild(sig);
  container.scrollTop = container.scrollHeight;
  typewriterRunning = false;
  container.dispatchEvent(new CustomEvent('letterDone'));
}
