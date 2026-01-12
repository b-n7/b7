import axios from 'axios';

export default {
  name: 'humanizer',
  description: 'Transform AI-generated text into more human-like writing',
  category: 'ai',
  aliases: ['humanize', 'makehuman', 'naturalize', 'rewrite'],
  usage: 'humanizer [text or reply to message] [style]',
  
  async execute(sock, m, args, PREFIX) {
    const jid = m.key.remoteJid;
    
    // Help section
    if (args.length === 0 || args[0].toLowerCase() === 'help') {
      const helpText = `✍️ *TEXT HUMANIZER*\n\n` +
        `Transform AI-generated text into natural human-like writing\n\n` +
        `📌 *Usage:*\n` +
        `• \`${PREFIX}humanizer your text here\`\n` +
        `• Reply to any message with \`${PREFIX}humanizer\`\n` +
        `• Add style: \`${PREFIX}humanizer text casual\`\n\n` +
        `🎨 *Available Styles:*\n` +
        `• \`casual\` - Everyday conversation\n` +
        `• \`professional\` - Business/work\n` +
        `• \`creative\` - Storytelling/creative\n` +
        `• \`academic\` - Educational content\n` +
        `• \`social\` - Social media posts\n` +
        `• \`email\` - Email communication\n` +
        `• \`blog\` - Blog/article writing\n\n` +
        `✨ *Features:*\n` +
        `• Removes AI patterns\n` +
        `• Adds natural variation\n` +
        `• Improves readability\n` +
        `• Adjusts tone and style\n` +
        `• Preserves original meaning`;
      
      return sock.sendMessage(jid, { text: helpText }, { quoted: m });
    }

    // Parse style if provided
    const availableStyles = ['casual', 'professional', 'creative', 'academic', 'social', 'email', 'blog'];
    let style = 'casual';
    let textParts = args;
    
    // Check if last arg is a style
    if (availableStyles.includes(args[args.length - 1]?.toLowerCase())) {
      style = args[args.length - 1].toLowerCase();
      textParts = args.slice(0, -1);
    }
    
    // Get text to humanize
    let text = textParts.join(' ');
    
    // Check for quoted message
    if (m.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
      const quoted = m.message.extendedTextMessage.contextInfo.quotedMessage;
      text = quoted.conversation || 
             quoted.extendedTextMessage?.text || 
             quoted.imageMessage?.caption ||
             quoted.videoMessage?.caption ||
             text;
    }

    if (!text || text.length < 10) {
      return sock.sendMessage(jid, {
        text: `❌ *Text Too Short*\n\n` +
              `Please provide at least 10 characters to humanize.\n` +
              `Example: \`${PREFIX}humanizer This is an AI-generated text that needs to sound more natural.\``
      }, { quoted: m });
    }

    // Show processing message
    const status = await sock.sendMessage(jid, {
      text: `✍️ *HUMANIZING TEXT*\n\n` +
            `📝 *Original:* "${text.substring(0, 60)}${text.length > 60 ? '...' : ''}"\n` +
            `🎨 *Style:* ${style.toUpperCase()}\n` +
            `⚡ *Transforming AI patterns into natural writing...*\n\n` +
            `⏳ *Processing...*`
    }, { quoted: m });

    try {
      // Step 1: Analyze text for AI patterns
      const analysis = await analyzeTextForHumanization(text);
      
      // Step 2: Apply humanization techniques
      const humanizedText = await humanizeText(text, style, analysis);
      
      // Step 3: Generate comparison report
      const report = await generateHumanizationReport(text, humanizedText, style, analysis);
      
      // Send result
      await sock.sendMessage(jid, {
        text: report,
        edit: status.key
      });

    } catch (error) {
      console.error('Humanizer error:', error);
      
      // Fallback to local humanization
      const humanizedText = localHumanizeText(text, style);
      const report = generateSimpleReport(text, humanizedText, style);
      
      await sock.sendMessage(jid, {
        text: report + '\n\n⚠️ *Note: Using local humanization methods*',
        edit: status.key
      });
    }
  }
};

// ==================== TEXT ANALYSIS ====================

async function analyzeTextForHumanization(text) {
  console.log(`Analyzing text for humanization (${text.length} chars)`);
  
  const analysis = {
    aiIndicators: [],
    humanIndicators: [],
    improvementAreas: [],
    toneScore: 0,
    readabilityScore: 0,
    personalizationScore: 0,
    naturalnessScore: 0
  };
  
  // Check for common AI patterns
  const aiPatterns = [
    { pattern: /as an ai language model/i, name: 'AI disclaimer' },
    { pattern: /based on my training data/i, name: 'Training data reference' },
    { pattern: /i don't have personal (experiences|emotions)/i, name: 'Emotion disclaimer' },
    { pattern: /firstly.*secondly.*thirdly/i, name: 'Numbered structure' },
    { pattern: /in conclusion.*(to sum up|overall)/i, name: 'Formal conclusion' },
    { pattern: /it is important to note that/i, name: 'Academic phrasing' },
    { pattern: /this (ensures|guarantees|provides)/i, name: 'Corporate phrasing' },
    { pattern: /\b(utilize|facilitate|implement|optimize)\b/i, name: 'Corporate jargon' },
    { pattern: /on one hand.*on the other hand/i, name: 'Balanced perspective' },
    { pattern: /there are several (reasons|factors|aspects)/i, name: 'Enumerative introduction' }
  ];
  
  // Check for human patterns
  const humanPatterns = [
    { pattern: /\b(lol|lmao|haha|hehe)\b/i, name: 'Laughter expressions' },
    { pattern: /\b(omg|wtf|smh|tbh|imo)\b/i, name: 'Internet slang' },
    { pattern: /i (think|feel|believe)/i, name: 'Personal opinion' },
    { pattern: /in my (opinion|experience)/i, name: 'Personal perspective' },
    { pattern: /personally.*i/i, name: 'Personal voice' },
    { pattern: /\b(like|you know|i mean)\b/i, name: 'Conversational fillers' },
    { pattern: /typo|mistake|error.*made/i, name: 'Self-correction' },
    { pattern: /sorry.*(typo|mistake)/i, name: 'Apology for errors' }
  ];
  
  // Analyze sentence structure
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/);
  
  // Detect AI patterns
  aiPatterns.forEach(({ pattern, name }) => {
    if (pattern.test(text)) {
      analysis.aiIndicators.push(name);
    }
  });
  
  // Detect human patterns
  humanPatterns.forEach(({ pattern, name }) => {
    if (pattern.test(text)) {
      analysis.humanIndicators.push(name);
    }
  });
  
  // Sentence structure analysis
  if (sentences.length > 0) {
    const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
    const avgSentenceLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentences.length;
    const lengthVariation = calculateStandardDeviation(sentenceLengths);
    
    // AI text often has consistent sentence length
    if (lengthVariation < 3) {
      analysis.improvementAreas.push('Sentence length too consistent');
    }
    
    // Very long sentences
    if (avgSentenceLength > 25) {
      analysis.improvementAreas.push('Sentences too long');
    }
    
    // Analyze vocabulary
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const lexicalDiversity = uniqueWords.size / words.length;
    
    if (lexicalDiversity < 0.4) {
      analysis.improvementAreas.push('Low vocabulary diversity');
    }
  }
  
  // Check for personal pronouns
  const personalPronouns = countPersonalPronouns(text);
  if (personalPronouns < 2) {
    analysis.improvementAreas.push('Lack of personal pronouns');
  }
  
  // Check for contractions
  const contractions = countContractions(text);
  if (contractions < 1) {
    analysis.improvementAreas.push('No contractions used');
  }
  
  // Check for emotional words
  const emotionalWords = countEmotionalWords(text);
  if (emotionalWords < 1) {
    analysis.improvementAreas.push('Lack of emotional language');
  }
  
  // Calculate scores
  analysis.toneScore = calculateToneScore(text);
  analysis.readabilityScore = calculateReadabilityScore(text);
  analysis.personalizationScore = calculatePersonalizationScore(text);
  analysis.naturalnessScore = calculateNaturalnessScore(text);
  
  return analysis;
}

// ==================== HUMANIZATION ENGINE ====================

async function humanizeText(text, style, analysis) {
  console.log(`Humanizing text with style: ${style}`);
  
  try {
    // Use GPT API for advanced humanization
    const prompt = createHumanizationPrompt(text, style, analysis);
    
    const response = await axios.get('https://iamtkm.vercel.app/ai/gpt5', {
      params: {
        apikey: 'tkm',
        text: prompt
      },
      timeout: 30000
    });
    
    let humanizedText = response.data?.result || response.data?.response || '';
    
    // Clean up the response
    humanizedText = humanizedText
      .replace(/^["']|["']$/g, '') // Remove quotes
      .replace(/^Humanized text:\s*/i, '')
      .replace(/^Response:\s*/i, '')
      .trim();
    
    // If API returns nonsense, fall back to local methods
    if (humanizedText.length < text.length * 0.3 || humanizedText === text) {
      throw new Error('API returned insufficient or identical text');
    }
    
    return humanizedText;
    
  } catch (error) {
    console.log('API failed, using local humanization');
    return localHumanizeText(text, style);
  }
}

function createHumanizationPrompt(originalText, style, analysis) {
  const styleInstructions = {
    casual: 'Make this sound like natural everyday conversation. Use contractions, informal language, and personal pronouns.',
    professional: 'Make this professional but natural for business communication. Keep it clear and concise but not robotic.',
    creative: 'Make this creative and engaging for storytelling. Add descriptive language and vary sentence structure.',
    academic: 'Make this suitable for educational content. Keep it informative but more engaging and less formal.',
    social: 'Make this perfect for social media. Keep it short, engaging, and use appropriate hashtags if relevant.',
    email: 'Make this suitable for email communication. Professional but warm, with proper email structure.',
    blog: 'Make this engaging for blog/article writing. Add personality while keeping it informative.'
  };
  
  let prompt = `Rewrite this text to sound more human and natural. `;
  prompt += `${styleInstructions[style]}\n\n`;
  
  // Add specific improvements based on analysis
  if (analysis.improvementAreas.length > 0) {
    prompt += `Specifically address these issues:\n`;
    analysis.improvementAreas.forEach(area => {
      prompt += `- ${area}\n`;
    });
    prompt += `\n`;
  }
  
  // Instructions for humanization
  prompt += `Apply these humanization techniques:\n`;
  prompt += `1. Remove any AI-sounding phrases\n`;
  prompt += `2. Add natural variation in sentence length\n`;
  prompt += `3. Use contractions where appropriate\n`;
  prompt += `4. Add personal pronouns and opinions\n`;
  prompt += `5. Make the tone match ${style} style\n`;
  prompt += `6. Keep the original meaning intact\n`;
  prompt += `7. Make it sound like a real person wrote it\n\n`;
  
  prompt += `Text to humanize:\n"${originalText}"\n\n`;
  prompt += `Provide ONLY the humanized version without any explanation.`;
  
  return prompt;
}

// ==================== LOCAL HUMANIZATION (FALLBACK) ====================

function localHumanizeText(text, style) {
  console.log(`Using local humanization for style: ${style}`);
  
  // Apply multiple transformation passes
  let humanized = text;
  
  // Pass 1: Remove AI patterns
  humanized = removeAIPatterns(humanized);
  
  // Pass 2: Apply style-specific transformations
  humanized = applyStyleTransformations(humanized, style);
  
  // Pass 3: Add natural variations
  humanized = addNaturalVariations(humanized);
  
  // Pass 4: Improve readability
  humanized = improveReadability(humanized);
  
  return humanized;
}

function removeAIPatterns(text) {
  let result = text;
  
  // Remove AI disclaimers
  const aiPhrases = [
    { pattern: /\bas an ai language model\b/gi, replacement: '' },
    { pattern: /\bbased on my training data\b/gi, replacement: 'Based on what I know' },
    { pattern: /\bi don't have personal (experiences|emotions)\b/gi, replacement: '' },
    { pattern: /\bas a large language model\b/gi, replacement: '' },
    { pattern: /\bi am an ai\b/gi, replacement: '' },
    { pattern: /\bi cannot (feel|experience|have emotions)\b/gi, replacement: '' }
  ];
  
  aiPhrases.forEach(({ pattern, replacement }) => {
    result = result.replace(pattern, replacement);
  });
  
  // Replace formal academic phrases
  const formalPhrases = [
    { pattern: /\bit is important to note that\b/gi, replacement: 'It\'s worth noting that' },
    { pattern: /\bin conclusion\b/gi, replacement: 'So to wrap up' },
    { pattern: /\bto sum up\b/gi, replacement: 'In short' },
    { pattern: /\bwith regard to\b/gi, replacement: 'About' },
    { pattern: /\bin order to\b/gi, replacement: 'To' },
    { pattern: /\bwith the purpose of\b/gi, replacement: 'To' },
    { pattern: /\bat this point in time\b/gi, replacement: 'Now' },
    { pattern: /\bdue to the fact that\b/gi, replacement: 'Because' }
  ];
  
  formalPhrases.forEach(({ pattern, replacement }) => {
    result = result.replace(pattern, replacement);
  });
  
  return result.trim();
}

function applyStyleTransformations(text, style) {
  let result = text;
  
  switch (style) {
    case 'casual':
      result = makeTextCasual(result);
      break;
    case 'professional':
      result = makeTextProfessional(result);
      break;
    case 'creative':
      result = makeTextCreative(result);
      break;
    case 'academic':
      result = makeTextAcademic(result);
      break;
    case 'social':
      result = makeTextSocial(result);
      break;
    case 'email':
      result = makeTextEmail(result);
      break;
    case 'blog':
      result = makeTextBlog(result);
      break;
  }
  
  return result;
}

function makeTextCasual(text) {
  let result = text;
  
  // Add contractions
  result = addContractions(result);
  
  // Add conversational fillers occasionally
  if (Math.random() > 0.7) {
    const fillers = ['You know, ', 'I mean, ', 'Honestly, ', 'Basically, '];
    const sentences = result.split(/(?<=[.!?])\s+/);
    if (sentences.length > 0) {
      sentences[0] = fillers[Math.floor(Math.random() * fillers.length)] + sentences[0];
      result = sentences.join(' ');
    }
  }
  
  // Add personal pronouns
  result = addPersonalPronouns(result);
  
  // Shorten sentences
  result = shortenSentences(result);
  
  return result;
}

function makeTextProfessional(text) {
  let result = text;
  
  // Remove overly casual language
  result = result.replace(/\b(lol|lmao|omg|wtf)\b/gi, '');
  
  // Ensure clarity but keep natural flow
  result = improveClarity(result);
  
  // Add appropriate professional tone
  const sentences = result.split(/(?<=[.!?])\s+/);
  if (sentences.length > 0 && !/^thanks|^thank you/i.test(sentences[0])) {
    sentences[0] = 'I wanted to share that ' + sentences[0].toLowerCase();
    result = sentences.join(' ');
  }
  
  return result;
}

function makeTextCreative(text) {
  let result = text;
  
  // Add descriptive adjectives
  const adjectives = ['amazing', 'incredible', 'fascinating', 'interesting', 'remarkable'];
  const words = result.split(' ');
  const descriptiveWords = words.filter(w => 
    /^[A-Z][a-z]+$/.test(w) && w.length > 5
  );
  
  if (descriptiveWords.length > 0) {
    const randomIndex = Math.floor(Math.random() * descriptiveWords.length);
    const wordIndex = words.indexOf(descriptiveWords[randomIndex]);
    if (wordIndex > 0) {
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      words[wordIndex] = adj + ' ' + words[wordIndex];
      result = words.join(' ');
    }
  }
  
  // Vary sentence structure more
  result = varySentenceStructure(result);
  
  // Add sensory language
  const sensoryWords = ['feel', 'see', 'hear', 'imagine', 'experience'];
  sensoryWords.forEach(word => {
    if (!result.toLowerCase().includes(word) && Math.random() > 0.8) {
      const sentences = result.split(/(?<=[.!?])\s+/);
      if (sentences.length > 0) {
        const randomSentence = Math.floor(Math.random() * sentences.length);
        sentences[randomSentence] = `You can almost ${word} it - ${sentences[randomSentence].toLowerCase()}`;
        result = sentences.join(' ');
      }
    }
  });
  
  return result;
}

function makeTextAcademic(text) {
  let result = text;
  
  // Keep it informative but more engaging
  result = result.replace(/\bit is important to note that\b/gi, 'What\'s interesting is that');
  result = result.replace(/\bin this essay\b/gi, 'Here');
  
  // Add transition words for flow
  const transitions = ['Moreover, ', 'Additionally, ', 'Furthermore, ', 'However, '];
  const sentences = result.split(/(?<=[.!?])\s+/);
  
  for (let i = 1; i < sentences.length && i < 4; i++) {
    if (Math.random() > 0.5) {
      sentences[i] = transitions[Math.floor(Math.random() * transitions.length)] + sentences[i];
    }
  }
  
  result = sentences.join(' ');
  
  return result;
}

function makeTextSocial(text) {
  let result = text;
  
  // Shorten significantly
  result = shortenText(result, 280); // Twitter-like length
  
  // Add hashtags if relevant
  const topics = extractTopics(text);
  if (topics.length > 0) {
    const hashtags = topics.slice(0, 3).map(t => `#${t.replace(/\s+/g, '')}`);
    result += ' ' + hashtags.join(' ');
  }
  
  // Add emojis occasionally
  const emojis = ['😊', '✨', '🌟', '💡', '👍', '🔥'];
  if (Math.random() > 0.5) {
    const sentences = result.split(/(?<=[.!?])\s+/);
    if (sentences.length > 0) {
      const lastSentence = sentences[sentences.length - 1];
      sentences[sentences.length - 1] = lastSentence + ' ' + emojis[Math.floor(Math.random() * emojis.length)];
      result = sentences.join(' ');
    }
  }
  
  return result;
}

function makeTextEmail(text) {
  let result = text;
  
  // Add email structure
  const sentences = result.split(/(?<=[.!?])\s+/);
  
  if (sentences.length > 0) {
    // Add greeting if missing
    if (!/^(hi|hello|dear|hi there)/i.test(sentences[0])) {
      const greetings = ['Hi there,', 'Hello,', 'Hi,', 'Hey,'];
      sentences[0] = greetings[Math.floor(Math.random() * greetings.length)] + ' ' + sentences[0];
    }
    
    // Add closing if missing
    if (!/(best|regards|thanks|sincerely)/i.test(sentences[sentences.length - 1])) {
      const closings = ['Best regards,', 'Thanks,', 'Cheers,', 'Take care,'];
      sentences.push(closings[Math.floor(Math.random() * closings.length)]);
    }
    
    result = sentences.join('\n\n');
  }
  
  return result;
}

function makeTextBlog(text) {
  let result = text;
  
  // Make it more engaging for reading
  const sentences = result.split(/(?<=[.!?])\s+/);
  
  if (sentences.length > 0) {
    // Add a hook/question at the beginning
    if (!/\?$/.test(sentences[0])) {
      const hooks = [
        'Have you ever wondered... ',
        'Let me tell you something interesting... ',
        'Here\'s what I discovered... '
      ];
      sentences[0] = hooks[Math.floor(Math.random() * hooks.length)] + sentences[0];
    }
    
    // Add paragraph breaks for readability
    result = sentences.join('\n\n');
  }
  
  // Add subheadings if long enough
  if (result.length > 300) {
    const parts = result.split('\n\n');
    if (parts.length > 2) {
      parts[1] = '## The Key Points\n\n' + parts[1];
      result = parts.join('\n\n');
    }
  }
  
  return result;
}

function addNaturalVariations(text) {
  let result = text;
  
  // Vary sentence length
  result = varySentenceLength(result);
  
  // Add occasional conversational elements
  if (Math.random() > 0.7) {
    const conversational = ['By the way, ', 'Actually, ', 'You know what? ', 'Interesting thing is, '];
    const sentences = result.split(/(?<=[.!?])\s+/);
    if (sentences.length > 1) {
      const insertAt = Math.floor(Math.random() * (sentences.length - 1)) + 1;
      sentences.splice(insertAt, 0, conversational[Math.floor(Math.random() * conversational.length)]);
      result = sentences.join(' ');
    }
  }
  
  // Add occasional personal reflection
  if (Math.random() > 0.8) {
    const reflections = [
      ' I find this really fascinating.',
      ' It\'s something worth thinking about.',
      ' This reminds me of something similar.',
      ' What do you think about this?'
    ];
    result += reflections[Math.floor(Math.random() * reflections.length)];
  }
  
  return result;
}

function improveReadability(text) {
  let result = text;
  
  // Break up long sentences
  const sentences = result.split(/(?<=[.!?])\s+/);
  const improvedSentences = sentences.map(sentence => {
    if (sentence.split(/\s+/).length > 25) {
      // Split on conjunctions or commas
      const parts = sentence.split(/(, and|, but|, or|, so|;)/);
      if (parts.length > 1) {
        return parts.join(' '); // Keep split but add space
      } else {
        // Split on commas
        const commaParts = sentence.split(/,/);
        if (commaParts.length > 1) {
          return commaParts.slice(0, -1).join(',') + '. ' + commaParts[commaParts.length - 1];
        }
      }
    }
    return sentence;
  });
  
  result = improvedSentences.join(' ');
  
  // Ensure proper spacing
  result = result.replace(/\s+/g, ' ').replace(/\s([.,!?])/g, '$1');
  
  return result;
}

// ==================== UTILITY FUNCTIONS ====================

function addContractions(text) {
  const contractionsMap = {
    'do not': 'don\'t',
    'does not': 'doesn\'t',
    'did not': 'didn\'t',
    'cannot': 'can\'t',
    'could not': 'couldn\'t',
    'will not': 'won\'t',
    'would not': 'wouldn\'t',
    'should not': 'shouldn\'t',
    'is not': 'isn\'t',
    'are not': 'aren\'t',
    'was not': 'wasn\'t',
    'were not': 'weren\'t',
    'have not': 'haven\'t',
    'has not': 'hasn\'t',
    'had not': 'hadn\'t',
    'i am': 'I\'m',
    'you are': 'you\'re',
    'he is': 'he\'s',
    'she is': 'she\'s',
    'it is': 'it\'s',
    'we are': 'we\'re',
    'they are': 'they\'re',
    'there is': 'there\'s',
    'there are': 'there\'re',
    'that is': 'that\'s',
    'what is': 'what\'s',
    'who is': 'who\'s',
    'where is': 'where\'s',
    'when is': 'when\'s',
    'why is': 'why\'s',
    'how is': 'how\'s'
  };
  
  let result = text;
  Object.entries(contractionsMap).forEach(([full, contraction]) => {
    const regex = new RegExp(`\\b${full}\\b`, 'gi');
    result = result.replace(regex, contraction);
  });
  
  return result;
}

function addPersonalPronouns(text) {
  let result = text;
  const sentences = result.split(/(?<=[.!?])\s+/);
  
  // Check if first person is used, if not, add it to some sentences
  const hasFirstPerson = /I |me |my |mine |we |us |our/i.test(text);
  
  if (!hasFirstPerson && sentences.length > 0) {
    // Add "I think" or similar to some sentences
    for (let i = 0; i < Math.min(2, sentences.length); i++) {
      if (Math.random() > 0.5) {
        const starters = ['I think ', 'I believe ', 'I feel ', 'In my opinion, '];
        sentences[i] = starters[Math.floor(Math.random() * starters.length)] + sentences[i].toLowerCase();
      }
    }
    result = sentences.join(' ');
  }
  
  return result;
}

function shortenSentences(text) {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const shortened = sentences.map(sentence => {
    const words = sentence.split(/\s+/);
    if (words.length > 20) {
      // Try to split on conjunctions
      const conjunctions = [' and ', ' but ', ' or ', ' so ', ' yet ', ' however ', ' therefore '];
      for (const conj of conjunctions) {
        if (sentence.includes(conj)) {
          const parts = sentence.split(conj);
          if (parts.length > 1) {
            return parts[0] + '.' + conj + parts.slice(1).join(conj);
          }
        }
      }
      
      // Split on commas
      const commaParts = sentence.split(/,/);
      if (commaParts.length > 2) {
        return commaParts[0] + '. ' + commaParts.slice(1).join(',');
      }
    }
    return sentence;
  });
  
  return shortened.join(' ');
}

function improveClarity(text) {
  let result = text;
  
  // Replace complex words with simpler ones where appropriate
  const simplifications = [
    { complex: /\butilize\b/gi, simple: 'use' },
    { complex: /\bfacilitate\b/gi, simple: 'help' },
    { complex: /\bimplement\b/gi, simple: 'put in place' },
    { complex: /\boptimize\b/gi, simple: 'improve' },
    { complex: /\bstrategize\b/gi, simple: 'plan' },
    { complex: /\bleverage\b/gi, simple: 'use' },
    { complex: /\bsynergize\b/gi, simple: 'work together' },
    { complex: /\bparadigm\b/gi, simple: 'model' },
    { complex: /\bbandwidth\b/gi, simple: 'time' },
    { complex: /\btouch base\b/gi, simple: 'check in' }
  ];
  
  simplifications.forEach(({ complex, simple }) => {
    result = result.replace(complex, simple);
  });
  
  return result;
}

function varySentenceStructure(text) {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const varied = sentences.map((sentence, index) => {
    // Every few sentences, change the structure
    if (index % 3 === 0 && index > 0) {
      const starters = [
        'What\'s really interesting is that ',
        'The thing is, ',
        'Here\'s the key point: ',
        'Let me put it this way: '
      ];
      return starters[Math.floor(Math.random() * starters.length)] + sentence.toLowerCase();
    }
    return sentence;
  });
  
  return varied.join(' ');
}

function shortenText(text, maxLength) {
  if (text.length <= maxLength) return text;
  
  // Try to cut at a sentence boundary
  const sentences = text.split(/(?<=[.!?])\s+/);
  let result = '';
  
  for (const sentence of sentences) {
    if ((result + ' ' + sentence).length <= maxLength) {
      result += (result ? ' ' : '') + sentence;
    } else {
      break;
    }
  }
  
  // If still too long, cut at word boundary
  if (result.length === 0 || result.length > maxLength) {
    result = text.substring(0, maxLength - 3);
    const lastSpace = result.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.7) {
      result = result.substring(0, lastSpace);
    }
    result += '...';
  }
  
  return result;
}

function extractTopics(text) {
  const words = text.toLowerCase().split(/\s+/);
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were']);
  
  // Count word frequencies
  const freq = {};
  words.forEach(word => {
    const cleanWord = word.replace(/[^a-z]/g, '');
    if (cleanWord.length > 3 && !commonWords.has(cleanWord)) {
      freq[cleanWord] = (freq[cleanWord] || 0) + 1;
    }
  });
  
  // Get top 5 words
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}

function varySentenceLength(text) {
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  // Ensure variation in sentence length
  const variedSentences = sentences.map((sentence, index) => {
    const words = sentence.split(/\s+/).length;
    
    // Occasionally create very short sentences for emphasis
    if (index > 0 && index % 4 === 0 && words > 10) {
      // Split into two shorter sentences
      const midpoint = Math.floor(words / 2);
      const sentenceWords = sentence.split(/\s+/);
      const firstPart = sentenceWords.slice(0, midpoint).join(' ');
      const secondPart = sentenceWords.slice(midpoint).join(' ');
      return firstPart + '. ' + secondPart;
    }
    
    return sentence;
  });
  
  return variedSentences.join(' ');
}

// ==================== ANALYSIS UTILITIES ====================

function calculateStandardDeviation(numbers) {
  if (numbers.length === 0) return 0;
  
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / numbers.length;
  
  return Math.sqrt(variance);
}

function countPersonalPronouns(text) {
  const pronouns = [' I ', ' me ', ' my ', ' mine ', ' we ', ' us ', ' our ', ' ours '];
  let count = 0;
  
  pronouns.forEach(pronoun => {
    const regex = new RegExp(pronoun, 'gi');
    const matches = text.match(regex);
    if (matches) count += matches.length;
  });
  
  return count;
}

function countContractions(text) {
  const contractions = [
    "don't", "can't", "won't", "isn't", "aren't", "wasn't", "weren't",
    "haven't", "hasn't", "hadn't", "wouldn't", "couldn't", "shouldn't",
    "i'm", "you're", "he's", "she's", "it's", "we're", "they're",
    "i've", "you've", "we've", "they've", "i'd", "you'd", "he'd",
    "she'd", "we'd", "they'd", "i'll", "you'll", "he'll", "she'll",
    "we'll", "they'll", "that's", "there's", "what's", "who's"
  ];
  
  let count = 0;
  contractions.forEach(contraction => {
    const regex = new RegExp(`\\b${contraction}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) count += matches.length;
  });
  
  return count;
}

function countEmotionalWords(text) {
  const emotionalWords = [
    'love', 'hate', 'happy', 'sad', 'angry', 'excited', 'frustrated',
    'disappointed', 'hopeful', 'anxious', 'joy', 'sorrow', 'fear',
    'surprise', 'disgust', 'passion', 'despair', 'euphoria', 'melancholy',
    'amazing', 'terrible', 'awesome', 'awful', 'wonderful', 'horrible'
  ];
  
  let count = 0;
  emotionalWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) count += matches.length;
  });
  
  return count;
}

function calculateToneScore(text) {
  // Higher score = more formal/robotic
  let score = 50;
  
  // Formal indicators increase score
  const formalIndicators = ['therefore', 'however', 'moreover', 'furthermore', 'consequently'];
  formalIndicators.forEach(indicator => {
    const regex = new RegExp(`\\b${indicator}\\b`, 'gi');
    if (regex.test(text)) score += 10;
  });
  
  // Informal indicators decrease score
  const informalIndicators = ['lol', 'lmao', 'omg', 'haha', 'hehe'];
  informalIndicators.forEach(indicator => {
    const regex = new RegExp(`\\b${indicator}\\b`, 'gi');
    if (regex.test(text)) score -= 15;
  });
  
  // Contractions decrease score (more casual)
  const contractions = countContractions(text);
  score -= contractions * 2;
  
  return Math.max(0, Math.min(100, score));
}

function calculateReadabilityScore(text) {
  // Simplified readability calculation
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/);
  
  if (sentences.length === 0 || words.length === 0) return 50;
  
  const avgSentenceLength = words.length / sentences.length;
  const avgWordLength = text.replace(/[^a-z]/gi, '').length / words.length;
  
  // Lower score = easier to read
  let score = 50;
  
  if (avgSentenceLength > 20) score += 20;
  if (avgWordLength > 5) score += 15;
  
  return Math.max(0, Math.min(100, score));
}

function calculatePersonalizationScore(text) {
  let score = 0;
  
  // Personal pronouns
  const personalPronouns = countPersonalPronouns(text);
  score += personalPronouns * 5;
  
  // Opinions/feelings
  const opinionWords = ['think', 'feel', 'believe', 'opinion'];
  opinionWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(text)) score += 10;
  });
  
  // First person sentences
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const firstPersonSentences = sentences.filter(s => /^I |^My |^We /.test(s));
  score += (firstPersonSentences.length / sentences.length) * 30;
  
  return Math.min(100, score);
}

function calculateNaturalnessScore(text) {
  // Combined score of various naturalness factors
  let score = 50;
  
  // Sentence length variation
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length > 1) {
    const lengths = sentences.map(s => s.split(/\s+/).length);
    const stdDev = calculateStandardDeviation(lengths);
    if (stdDev > 5) score += 10; // Good variation
    if (stdDev < 2) score -= 10; // Too uniform
  }
  
  // Contractions
  const contractions = countContractions(text);
  score += contractions * 2;
  
  // Emotional words
  const emotionalWords = countEmotionalWords(text);
  score += emotionalWords * 3;
  
  // Conversational markers
  const conversational = ['you know', 'i mean', 'like', 'actually', 'basically'];
  conversational.forEach(marker => {
    if (text.toLowerCase().includes(marker)) score += 5;
  });
  
  return Math.max(0, Math.min(100, score));
}

// ==================== REPORT GENERATION ====================

async function generateHumanizationReport(original, humanized, style, analysis) {
  const improvements = calculateImprovements(original, humanized, analysis);
  
  let report = `✍️ *TEXT HUMANIZATION REPORT*\n`;
  report += `━`.repeat(30) + `\n\n`;
  
  // Style and overview
  report += `🎨 *Style Applied:* ${style.toUpperCase()}\n`;
  report += `📊 *Humanization Level:* ${improvements.humanizationLevel}\n\n`;
  
  // Before/After comparison
  report += `📝 *ORIGINAL TEXT:*\n`;
  report += `"${truncateText(original, 100)}"\n\n`;
  
  report += `✨ *HUMANIZED TEXT:*\n`;
  report += `"${truncateText(humanized, 100)}"\n\n`;
  
  // Full humanized text (if not too long)
  if (humanized.length <= 500) {
    report += `📋 *FULL HUMANIZED VERSION:*\n`;
    report += `${humanized}\n\n`;
  }
  
  // Key improvements
  report += `📈 *KEY IMPROVEMENTS:*\n`;
  
  if (improvements.aiPatternsRemoved > 0) {
    report += `✅ Removed ${improvements.aiPatternsRemoved} AI patterns\n`;
  }
  
  if (improvements.readabilityImproved) {
    report += `✅ Improved readability by ${improvements.readabilityChange}%\n`;
  }
  
  if (improvements.personalizationIncreased > 0) {
    report += `✅ Added ${improvements.personalizationIncreased}% more personal touch\n`;
  }
  
  if (improvements.naturalnessImproved > 0) {
    report += `✅ Increased naturalness by ${improvements.naturalnessImproved}%\n`;
  }
  
  if (improvements.sentenceVariationAdded) {
    report += `✅ Added sentence structure variation\n`;
  }
  
  // Stats
  report += `\n📊 *STATISTICS:*\n`;
  report += `• Original length: ${original.length} chars\n`;
  report += `• Humanized length: ${humanized.length} chars\n`;
  report += `• Change: ${improvements.lengthChange > 0 ? '+' : ''}${improvements.lengthChange}%\n`;
  report += `• Sentence count: ${improvements.sentenceCount}\n`;
  report += `• Avg. sentence length: ${improvements.avgSentenceLength} words\n\n`;
  
  // Style-specific tips
  report += `💡 *STYLE TIPS FOR ${style.toUpperCase()}:*\n`;
  report += getStyleTips(style);
  
  // How to use
  report += `\n🎯 *HOW TO USE THIS TEXT:*\n`;
  report += getUsageTips(style);
  
  // Footer
  report += `\n` + `━`.repeat(30) + `\n`;
  report += `✍️ Humanized at: ${new Date().toLocaleTimeString()}\n`;
  report += `⚡ WolfBot Humanizer v2.0`;
  
  return report;
}

function generateSimpleReport(original, humanized, style) {
  let report = `✍️ *TEXT HUMANIZATION*\n`;
  report += `━`.repeat(30) + `\n\n`;
  
  report += `🎨 *Style:* ${style.toUpperCase()}\n\n`;
  
  report += `📝 *Before:*\n`;
  report += `"${truncateText(original, 80)}"\n\n`;
  
  report += `✨ *After:*\n`;
  report += `"${truncateText(humanized, 80)}"\n\n`;
  
  // Show full text if not too long
  if (humanized.length <= 400) {
    report += `📋 *Full Result:*\n`;
    report += `${humanized}\n\n`;
  }
  
  // Basic stats
  const origSentences = original.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const humanSentences = humanized.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const origWords = original.split(/\s+/).length;
  const humanWords = humanized.split(/\s+/).length;
  
  report += `📊 *Changes Made:*\n`;
  report += `• Removed AI-sounding phrases\n`;
  report += `• Added natural variations\n`;
  report += `• Adjusted tone for ${style} style\n`;
  report += `• Sentences: ${origSentences.length} → ${humanSentences.length}\n`;
  report += `• Words: ${origWords} → ${humanWords}\n\n`;
  
  report += `💡 *Tip:* Use for emails, social posts, or any content that needs a human touch!\n`;
  
  report += `\n` + `━`.repeat(30) + `\n`;
  report += `⚡ WolfBot Humanizer`;
  
  return report;
}

function calculateImprovements(original, humanized, analysis) {
  const origSentences = original.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const humanSentences = humanized.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  const origWords = original.split(/\s+/).length;
  const humanWords = humanized.split(/\s+/).length;
  
  // Calculate various metrics
  const aiPatternsRemoved = analysis.aiIndicators.length;
  
  const origReadability = calculateReadabilityScore(original);
  const humanReadability = calculateReadabilityScore(humanized);
  const readabilityChange = Math.round(((origReadability - humanReadability) / origReadability) * 100);
  
  const origPersonalization = calculatePersonalizationScore(original);
  const humanPersonalization = calculatePersonalizationScore(humanized);
  const personalizationIncreased = Math.round(((humanPersonalization - origPersonalization) / 100) * 100);
  
  const origNaturalness = calculateNaturalnessScore(original);
  const humanNaturalness = calculateNaturalnessScore(humanized);
  const naturalnessImproved = Math.round(((humanNaturalness - origNaturalness) / 100) * 100);
  
  const lengthChange = Math.round(((humanized.length - original.length) / original.length) * 100);
  
  // Determine humanization level
  let humanizationLevel = 'MODERATE';
  const totalImprovement = Math.abs(readabilityChange) + personalizationIncreased + naturalnessImproved;
  if (totalImprovement > 100) humanizationLevel = 'HIGH';
  if (totalImprovement < 30) humanizationLevel = 'LIGHT';
  
  return {
    aiPatternsRemoved,
    readabilityImproved: readabilityChange > 10,
    readabilityChange: Math.abs(readabilityChange),
    personalizationIncreased,
    naturalnessImproved,
    sentenceVariationAdded: Math.abs(origSentences.length - humanSentences.length) > 0,
    lengthChange,
    sentenceCount: humanSentences.length,
    avgSentenceLength: Math.round(humanWords / (humanSentences.length || 1)),
    humanizationLevel
  };
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

function getStyleTips(style) {
  const tips = {
    casual: '• Use contractions and informal language\n• Add personal pronouns\n• Keep sentences short and natural\n• Use conversational fillers occasionally',
    professional: '• Be clear and concise\n• Avoid slang but stay natural\n• Use professional vocabulary appropriately\n• Maintain respectful tone',
    creative: '• Use descriptive language\n• Vary sentence structure\n• Add sensory details\n• Create emotional connection',
    academic: '• Be informative but engaging\n• Use transition words\n• Support points clearly\n• Maintain educational tone',
    social: '• Keep it short and engaging\n• Use hashtags if relevant\n• Add emojis appropriately\n• Write for quick reading',
    email: '• Use proper email structure\n• Be professional but warm\n• Clear subject implied\n• Appropriate greetings/closings',
    blog: '• Hook readers immediately\n• Use subheadings for scannability\n• Add personality\n• End with call to action or reflection'
  };
  
  return tips[style] || tips.casual;
}

function getUsageTips(style) {
  const usages = {
    casual: 'Perfect for messages, chats, and informal communication with friends or colleagues.',
    professional: 'Ideal for business emails, reports, and professional correspondence.',
    creative: 'Great for stories, creative writing, marketing copy, and engaging content.',
    academic: 'Suitable for educational materials, tutorials, and informative content.',
    social: 'Optimized for social media posts, tweets, and online sharing.',
    email: 'Ready to use in email communication with proper structure.',
    blog: 'Perfect for blog posts, articles, and longer-form online content.'
  };
  
  return usages[style] || 'Use for any text that needs to sound more human and natural.';
}

// Export for testing if needed
export {
  localHumanizeText,
  analyzeTextForHumanization,
  calculateImprovements
};