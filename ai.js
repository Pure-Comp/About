/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/files");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

/**
 * Uploads the given file to Gemini.
 *
 * See https://ai.google.dev/gemini-api/docs/prompting_with_media
 */
async function uploadToGemini(path, mimeType) {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

/**
 * Waits for the given files to be active.
 *
 * Some files uploaded to the Gemini API need to be processed before they can
 * be used as prompt inputs. The status can be seen by querying the file's
 * "state" field.
 *
 * This implementation uses a simple blocking polling loop. Production code
 * should probably employ a more sophisticated approach.
 */
async function waitForFilesActive(files) {
  console.log("Waiting for file processing...");
  for (const name of files.map((file) => file.name)) {
    let file = await fileManager.getFile(name);
    while (file.state === "PROCESSING") {
      process.stdout.write(".")
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      file = await fileManager.getFile(name)
    }
    if (file.state !== "ACTIVE") {
      throw Error(`File ${file.name} failed to process`);
    }
  }
  console.log("...all files ready\n");
}

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run() {
  // TODO Make these files available on the local file system
  // You may need to update the file paths
  const files = [
    await uploadToGemini("Copy of Mission Statement", "application/vnd.google-apps.document"),
  ];

  // Some files have a processing delay. Wait for them to be ready.
  await waitForFilesActive(files);

  const chatSession = model.startChat({
    generationConfig,
 // safetySettings: Adjust safety settings
 // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[0].mimeType,
              fileUri: files[0].uri,
            },
          },
          {text: "Write a media slogan that is based upon the following text and write about a two page letter. From the following.:Launching PureComp- PuCo Felt like something that was automatically going to happen, When I was 3 I was just able to hold a floppy with less than a half a meg Necessary to boot into. the CLi (command line Interface(DOS)). But shortly after 2007. I was. distracted with life and started doing network engineering on cruise ships as well as other tech projects. and distracted traveling the world. Fast forward to. a year ago. even working normal jobs in this market was pretty crap. And then I remembered, I have a business. I did nothing with. And so 16 years later. I started. Helping people with computers again and. over the past year. have been working way more with marketing and business than actually doing the tech. and I find that that's what everyone has a problem with. They want the tech to work for them, but they end up working for the tech. now that hassle is finally. able to be alleviated. with smarter. workflows and. a. I. Computers they're still the same. but now they can program themselves. So instead of having to program your life, then figure out. how to do things that you've always wanted to do. You can skip that part and. I can. fill you in on the shortcuts. In the past month, I've gained more traction than every tech company here has in the last 10 years. And I'm not even popular by any means. But I am swamped. By the explosion, I was not expecting. Soon. I'll be expanding out of necessity. But the path to it was utterly. simple. but not so apparent. And now I have been helping others with that same path. Extremely successful now and media and marketing were not even what I had tried to Focus on. I know when I read things, I'm like, yeah, I don't need to do this. I don't need to do that. But this year I sat down and said, I absolutely need to do this, and I need to do this right now. because it was clear that. ai has. just popped its head out. And just like back when P C's and Internet started. Bill Gates and Steve Jobs. jumped in because they knew they had to, and they did it first. And they got cemented In because of their head start. So in the next year, whoever is going to be leading. AI will be cemented in as well and everyone else will be too late. So if you want to accelerate. your customer base and move faster than you probably want to it. that you can handle then. and give me a shout. Or if you just have a broke computer or want a gaming rig, whatever the case may be, I still enjoy that too."},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "## Slogan: **\"PureComp: Stop working *for* tech. Let tech work for *you*.**\"\n\n## Letter:\n\nDear [Recipient Name],\n\nRemember that feeling – that spark of pure excitement – when you first held a floppy disk? Back then, it felt like the future of technology was unfolding in our hands. For me, that feeling never faded.  At three years old, I was booting into DOS.  By my teens, I was building networks and exploring the world of tech.\n\nLife, as it often does, took me on a winding journey. I spent years traveling the globe, tackling complex network engineering projects on cruise ships and beyond.  But through it all, that early passion for technology never truly left me.\n\nFast forward to a year ago.  The job market felt stagnant, uninspiring. It was then I remembered: **I had a business**. A business I had poured my heart and soul into, but let lay dormant for far too long.\n\nSo, I dusted off the keyboard, rebooted my entrepreneurial spirit, and **PureComp was reborn**. \n\nOver the past year, I've been reminded of a fundamental truth: **People want technology to simplify their lives, not complicate them.** Yet, I see countless individuals and businesses struggling, drowning in a sea of software, apps, and devices that promise the world but deliver headaches.\n\nThat's why PureComp exists.  \n\nWe're not just about fixing broken computers or building powerful gaming rigs, though we certainly excel at both. We're about **bridging the gap between people and technology.** We help you harness the power of AI and automation, streamlining workflows, and reclaiming precious time.\n\nThe response has been nothing short of astounding. In the past month alone, PureComp has experienced a surge in growth unlike anything I could have imagined. Why? Because the need for what we offer is real, and the time to embrace it is **now**.\n\nJust like the dawn of the PC and the internet, the AI revolution is upon us.  Those who seize this moment, who leverage its potential early, will undoubtedly reap the greatest rewards. \n\nWhether you're a business looking to supercharge your growth, an individual yearning for a more streamlined life, or simply need help with your trusty (or not-so-trusty) computer, PureComp is here to help.\n\nLet's work together to unlock the true potential of technology – **a potential where technology works for you, not the other way around.** \n\nGet in touch today.\n\nSincerely,\n\n[Your Name]\n\nFounder, PureComp \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "add that my name is 'Nathaniel Mina' and my email is 'nate@PureComp.Net' and website is 'https://www.PureComp.Net'\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "## Slogan: **\"PureComp: Stop working *for* tech. Let tech work for *you*.**\"\n\n## Letter:\n\nDear [Recipient Name],\n\nRemember that feeling – that spark of pure excitement – when you first held a floppy disk? Back then, it felt like the future of technology was unfolding in our hands. For me, that feeling never faded.  At three years old, I was booting into DOS.  By my teens, I was building networks and exploring the world of tech.\n\nLife, as it often does, took me on a winding journey. I spent years traveling the globe, tackling complex network engineering projects on cruise ships and beyond.  But through it all, that early passion for technology never truly left me.\n\nFast forward to a year ago.  The job market felt stagnant, uninspiring. It was then I remembered: **I had a business**. A business I had poured my heart and soul into, but let lay dormant for far too long.\n\nSo, I dusted off the keyboard, rebooted my entrepreneurial spirit, and **PureComp was reborn**. \n\nOver the past year, I've been reminded of a fundamental truth: **People want technology to simplify their lives, not complicate them.** Yet, I see countless individuals and businesses struggling, drowning in a sea of software, apps, and devices that promise the world but deliver headaches.\n\nThat's why PureComp exists.  \n\nWe're not just about fixing broken computers or building powerful gaming rigs, though we certainly excel at both. We're about **bridging the gap between people and technology.** We help you harness the power of AI and automation, streamlining workflows, and reclaiming precious time.\n\nThe response has been nothing short of astounding. In the past month alone, PureComp has experienced a surge in growth unlike anything I could have imagined. Why? Because the need for what we offer is real, and the time to embrace it is **now**.\n\nJust like the dawn of the PC and the internet, the AI revolution is upon us.  Those who seize this moment, who leverage its potential early, will undoubtedly reap the greatest rewards. \n\nWhether you're a business looking to supercharge your growth, an individual yearning for a more streamlined life, or simply need help with your trusty (or not-so-trusty) computer, PureComp is here to help.\n\nLet's work together to unlock the true potential of technology – **a potential where technology works for you, not the other way around.** \n\nFeel free to reach out to me directly at nate@PureComp.Net or visit our website at https://www.PureComp.Net to learn more. \n\nSincerely,\n\nNathaniel Mina\n\nFounder, PureComp \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "make it a bit longer and export in html and css\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "## HTML (index.html):\n\n```html\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>PureComp - Let Tech Work For You</title>\n    <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n    <div class=\"container\">\n        <h1>A Letter from Nathaniel Mina, Founder of PureComp</h1>\n        <p>Remember that feeling – that spark of pure excitement – when you first held a floppy disk? Back then, it felt like the future of technology was unfolding in our hands. For me, that feeling never faded.  At three years old, I was booting into DOS; by my teens, I was building networks and exploring the world of tech.</p>\n\n        <p>Life, as it often does, took me on a winding journey. I spent years traveling the globe, tackling complex network engineering projects on cruise ships and beyond.  But through it all, that early passion for technology never truly left me.</p>\n\n        <p>Fast forward to a year ago.  The job market felt stagnant, uninspiring. It was then I remembered: <strong>I had a business.</strong> A business I had poured my heart and soul into, but let lay dormant for far too long.</p>\n\n        <p>So, I dusted off the keyboard, rebooted my entrepreneurial spirit, and <strong>PureComp was reborn</strong>.</p>\n\n        <p>Over the past year, I've been reminded of a fundamental truth: <strong>People want technology to simplify their lives, not complicate them.</strong> Yet, I see countless individuals and businesses struggling, drowning in a sea of software, apps, and devices that promise the world but deliver headaches.</p>\n\n        <p>That's why PureComp exists.</p>\n\n        <p>We're not just about fixing broken computers or building powerful gaming rigs, though we certainly excel at both. We're about <strong>bridging the gap between people and technology</strong>. We help you harness the power of AI and automation, streamlining workflows, and reclaiming precious time.</p>\n\n        <p>The response has been nothing short of astounding. In the past month alone, PureComp has experienced a surge in growth unlike anything I could have imagined. Why? Because the need for what we offer is real, and the time to embrace it is <strong>now</strong>.</p>\n\n        <p>Just like the dawn of the PC and the internet, the AI revolution is upon us.  Those who seize this moment, who leverage its potential early, will undoubtedly reap the greatest rewards. </p>\n\n        <p>Whether you're a business looking to supercharge your growth, an individual yearning for a more streamlined life, or simply need help with your trusty (or not-so-trusty) computer, PureComp is here to help.</p>\n\n        <p>Let's work together to unlock the true potential of technology – <strong>a potential where technology works for you, not the other way around</strong>.</p>\n\n        <p>Feel free to reach out to me directly at <a href=\"mailto:nate@PureComp.Net\">nate@PureComp.Net</a> or visit our website at <a href=\"https://www.PureComp.Net\">https://www.PureComp.Net</a> to learn more. </p>\n\n        <p class=\"signature\">Sincerely,<br>\n        Nathaniel Mina<br>\n        Founder, PureComp</p>\n    </div>\n</body>\n</html>\n```\n\n## CSS (style.css):\n\n```css\nbody {\n    font-family: Arial, sans-serif;\n    line-height: 1.6;\n    margin: 0;\n    padding: 0;\n    background-color: #f4f4f4;\n    color: #333;\n}\n\n.container {\n    max-width: 800px;\n    margin: 20px auto;\n    padding: 20px;\n    background-color: #fff;\n    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\n}\n\nh1 {\n    text-align: center;\n    margin-bottom: 20px;\n}\n\np {\n    margin-bottom: 15px;\n}\n\n.signature {\n    text-align: right;\n    font-style: italic;\n}\n\na {\n    color: #007bff;\n    text-decoration: none;\n}\n\na:hover {\n    text-decoration: underline;\n}\n```\n\nThis HTML and CSS code will create a visually appealing letter format for Nathaniel Mina's message. You can copy and paste this code into respective HTML and CSS files and open the HTML file in a browser to view the letter. \n"},
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  console.log(result.response.text());
}

run();
