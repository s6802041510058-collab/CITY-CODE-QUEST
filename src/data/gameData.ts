/**
 * Game Data & Educational Content for WEB CITY: CODE QUEST
 * Aligned with Vocational Certificate (ปวช.1) - Website Creating curriculum
 */

import { AreaInfo, Badge, InteractiveStation, Quest } from '../types/game';

export const INITIAL_AREAS: AreaInfo[] = [
  {
    id: 'web_central',
    name: 'WEB CENTRAL',
    thaiName: 'ใจกลางเว็บซิตี้ (จุดเริ่มต้น)',
    description: 'ศูนย์กลางเมืองดิจิทัล แหล่งเรียนรู้แนวคิดพื้นฐาน Website, Web Page, Homepage, Browser, Web Server และ URL',
    state: 'Active',
    coordinates: { x: 50, y: 85 }
  },
  {
    id: 'network_gateway',
    name: 'NETWORK GATEWAY',
    thaiName: 'ด่านเชื่อมต่อเครือข่าย',
    description: 'เส้นทางส่งผ่านข้อมูลตามสถาปัตยกรรม Client-Server, DNS และ HTTP Request/Response',
    state: 'Locked',
    requiredStars: 1,
    coordinates: { x: 50, y: 68 }
  },
  {
    id: 'html_factory',
    name: 'HTML FACTORY',
    thaiName: 'โรงงานผลิตแท็ก HTML',
    description: 'สายการผลิตแท็กพื้นฐาน <h1>, <p>, <img>, <a>, <ul>, <li> และการใช้งานโครงสร้างข้อมูล',
    state: 'Locked',
    requiredStars: 3,
    coordinates: { x: 50, y: 52 }
  },
  {
    id: 'structure_lab',
    name: 'STRUCTURE LAB',
    thaiName: 'ห้องปฏิบัติการโครงสร้างเว็บ',
    description: 'แล็บประกอบโครงสร้างหลัก <!DOCTYPE html>, <html>, <head>, <title>, <body>',
    state: 'Locked',
    requiredStars: 6,
    coordinates: { x: 65, y: 40 }
  },
  {
    id: 'tag_arena',
    name: 'TAG ARENA',
    thaiName: 'สนามประลองแท็ก HTML',
    description: 'สนามท้าประลองแก้โจทย์และปราบ Bug Monster ด้วยพลังคำสั่งแท็กและ Attribute',
    state: 'Locked',
    requiredStars: 9,
    coordinates: { x: 35, y: 40 }
  },
  {
    id: 'debug_district',
    name: 'DEBUG DISTRICT',
    thaiName: 'ย่านแก้ไขข้อผิดพลาด',
    description: 'ย่านที่ระบบเว็บเสียหายจาก Glitch และบั๊กในโค้ด ต้องตรวจสอบและแก้ Syntax ให้ถูกต้องเพื่อฟื้นฟูเมือง',
    state: 'Locked',
    requiredStars: 12,
    coordinates: { x: 35, y: 25 }
  },
  {
    id: 'ai_lab',
    name: 'AI LAB (BYTE)',
    thaiName: 'ห้องวิจัยปัญญาประดิษฐ์',
    description: 'ห้องปฏิบัติการพิเศษของ AI BYTE เรียนรู้เชิงลึก พร้อมรับคำแนะนำและการวิเคราะห์โค้ดขั้นสูง',
    state: 'Locked',
    requiredStars: 10,
    coordinates: { x: 65, y: 25 }
  },
  {
    id: 'creator_tower',
    name: 'CREATOR TOWER',
    thaiName: 'หอคอยนักสร้างเว็บ',
    description: 'จุดหมายปลายทางสูงสุด สรุปการเรียนรู้ด้วยการสร้างเว็บไซต์ Portfolio แนะนำตนเองบน Web Code Editor',
    state: 'Locked',
    requiredStars: 18,
    requiredBadges: ['Web Explorer', 'Network Navigator', 'HTML Builder', 'Structure Master', 'Tag Master', 'Bug Hunter'],
    coordinates: { x: 50, y: 10 }
  }
];

export const WEB_CENTRAL_STATIONS: InteractiveStation[] = [
  {
    id: 'browser_station',
    name: 'Browser Station',
    subtitle: 'สถานีเว็บเบราว์เซอร์',
    topic: 'Web Browser คืออะไร?',
    description: 'โปรแกรมประยุกต์สำหรับท่องโลกอินเทอร์เน็ต ทำหน้าที่แปลงรหัส HTML/CSS/JS ให้เป็นหน้าจอสวยงามที่ผู้ใช้มองเห็น',
    detailedInfo: 'Web Browser เช่น Google Chrome, Microsoft Edge, Safari, Mozilla Firefox ทำหน้าที่ส่งคำขอ (HTTP Request) ไปยัง Web Server แล้วนำเอกสาร HTML ที่ได้รับกลับมาประมวลผล (Rendering Engine) แสดงเป็นข้อความ รูปภาพ ลิงก์ และวิดีโอ',
    quizQuestion: {
      question: 'ข้อใดคือหน้าที่หลักของโปรแกรม Web Browser?',
      options: [
        'เก็บฐานข้อมูลของทั้งโลกไว้ในเครื่องตนเอง',
        'แปลงและแสดงผลรหัส HTML/CSS ออกมาเป็นหน้าเว็บให้ผู้ใช้เห็น',
        'สร้างกระแสไฟฟ้าสำหรับเสาส่งสัญญาณเครือข่าย',
        'ซ่อมแซมสายเคเบิลอินเทอร์เน็ตใต้ทะเล'
      ],
      correctIndex: 1,
      explanation: 'ถูกต้อง! Web Browser ทำหน้าที่อ่านและแปลรหัส HTML, CSS, JavaScript เพื่อแสดงผลออกมาเป็นหน้าเว็บให้มนุษย์ใช้งานได้ง่าย'
    },
    x: 480,
    y: 420,
    discovered: false
  },
  {
    id: 'web_server_station',
    name: 'Web Server',
    subtitle: 'สถานีเครื่องแม่ข่ายเว็บ',
    topic: 'Web Server คืออะไร?',
    description: 'คอมพิวเตอร์แม่ข่ายสมรรถนะสูงที่เปิดให้บริการตลอด 24 ชั่วโมง มีซอฟต์แวร์คอยรับส่งข้อมูลไฟล์เว็บไซต์',
    detailedInfo: 'Web Server เช่น Apache, Nginx หรือ Cloud Server ทำหน้าที่เก็บไฟล์เว็บไซต์ทั้งหมด เช่น index.html, ไฟล์รูปภาพ, สไตล์ชีต เมื่อมีคนเรียกชื่อโดเมน Server จะตอบรับและส่งไฟล์กลับไปให้ Browser ของผู้ใช้',
    quizQuestion: {
      question: 'หากปิดเครื่อง Web Server จะส่งผลอย่างไรต่อผู้เข้าชมเว็บไซต์?',
      options: [
        'ผู้ใช้จะไม่สามารถเปิดหน้าเว็บไซต์นั้นได้ (เกิด Error เช่น Server Not Found)',
        'หน้าจอโทรศัพท์ของผู้ใช้จะดับลงทันที',
        'เว็บไซต์จะยังเปิดได้ตามปกติโดยไม่ต้องมีคนส่งไฟล์',
        'คอมพิวเตอร์ของผู้ใช้จะติดไวรัสโดยอัตโนมัติ'
      ],
      correctIndex: 0,
      explanation: 'ถูกต้อง! หาก Web Server หยุดทำงาน จะไม่มีเครื่องแม่ข่ายคอยส่งไฟล์ HTML กลับมา ทำให้ผู้ใช้ไม่สามารถเข้าชมเว็บไซต์ได้'
    },
    x: 1080,
    y: 420,
    discovered: false
  },
  {
    id: 'web_page_station',
    name: 'Web Page',
    subtitle: 'สถานีเว็บเพจ',
    topic: 'Web Page คืออะไร?',
    description: 'เอกสารข้อมูลหน้าเดี่ยวที่สร้างขึ้นด้วยภาษา HTML บรรจุเนื้อหา รูปภาพ หรือมัลติมีเดีย 1 หน้า',
    detailedInfo: 'Web Page เปรียบเสมือน “หน้าหนังสือ 1 หน้า” ในเล่ม เว็บไซต์หนึ่งเว็บจะประกอบด้วย Web Page หลายๆ หน้ารวมเข้าด้วยกันและเชื่อมต่อกันด้วย Hyperlink เช่น หน้าเกี่ยวกับเรา (about.html), หน้าติดต่อ (contact.html)',
    quizQuestion: {
      question: 'เปรียบเทียบ Web Page กับหนังสือ ข้อใดถูกต้องที่สุด?',
      options: [
        'Web Page เปรียบเสมือนหนังสือทั้งเล่ม',
        'Web Page เปรียบเสมือนปกหลังของหนังสือเท่านั้น',
        'Web Page เปรียบเสมือนหน้ากระดาษ 1 หน้าในหนังสือเล่มนั้น',
        'Web Page เปรียบเสมือนแท่นพิมพ์หนังสือ'
      ],
      correctIndex: 2,
      explanation: 'ถูกต้อง! Web Page คือเอกสารหน้าเดี่ยว 1 หน้า โดยเมื่อนำหลายๆ หน้ามารวมกันจึงจะกลายเป็น Website (หนังสือทั้งเล่ม)'
    },
    x: 480,
    y: 880,
    discovered: false
  },
  {
    id: 'homepage_station',
    name: 'Homepage',
    subtitle: 'สถานีโฮมเพจ (หน้าแรก)',
    topic: 'Homepage คืออะไร?',
    description: 'หน้าแรกสุดของเว็บไซต์ที่ผู้ใช้จะพบเมื่อพิมพ์ชื่อเว็บไซต์ เป็นเสมือนประตูต้อนรับและสารบัญรวมลิงก์',
    detailedInfo: 'Homepage มักจะตั้งชื่อไฟล์มาตรฐานว่า index.html หรือ default.html เพื่อให้ Web Server รู้ว่าต้องหยิบไฟล์นี้ขึ้นมาแสดงเป็นหน้าแรกเมื่อมีคนพิมพ์ชื่อโดเมนโดยไม่ระบุชื่อไฟล์',
    quizQuestion: {
      question: 'ชื่อไฟล์มาตรฐานที่เป็นสากลสำหรับหน้า Homepage ของเว็บไซต์คือชื่อใด?',
      options: [
        'first.html',
        'index.html',
        'mainpage.txt',
        'welcome.doc'
      ],
      correctIndex: 1,
      explanation: 'ถูกต้อง! index.html เป็นชื่อไฟล์สากลที่ Web Server ส่วนใหญ่ถูกตั้งค่าให้หยิบขึ้นมาแสดงผลเป็นหน้าแรกของเว็บไซต์เสมอ'
    },
    x: 1080,
    y: 880,
    discovered: false
  },
  {
    id: 'url_board_station',
    name: 'URL Board',
    subtitle: 'ป้ายบอกพิกัด URL',
    topic: 'URL (Uniform Resource Locator) คืออะไร?',
    description: 'ที่อยู่ระบุตำแหน่งเฉพาะของแหล่งข้อมูลบนอินเทอร์เน็ต เช่น https://www.webcity.edu/index.html',
    detailedInfo: 'URL ประกอบด้วย 3 ส่วนสำคัญ:\n1. Protocol (เช่น https://)\n2. Domain Name (เช่น www.example.com ระบุเครื่องเซิร์ฟเวอร์)\n3. Path/File (เช่น /contact.html ระบุหน้าที่ต้องการเข้าถึง)',
    quizQuestion: {
      question: 'จาก URL: "https://www.webcity.ac.th/about.html" ส่วนใดคือ Protocol?',
      options: [
        'about.html',
        'https://',
        'www.webcity.ac.th',
        'ac.th'
      ],
      correctIndex: 1,
      explanation: 'ถูกต้อง! https:// คือโปรโตคอล (Protocol) ที่กำหนดวิธีสื่อสารรักษาความปลอดภัยระหว่าง Browser กับ Server'
    },
    x: 780,
    y: 1120,
    discovered: false
  }
];

export const INITIAL_QUESTS: Quest[] = [
  {
    questId: 'M01',
    questName: 'MISSION 01: Explore Web City',
    areaId: 'web_central',
    npcId: 'npc_byte',
    objective: 'เดินสำรวจ Web Central และตรวจสอบสถานีความรู้พื้นฐานทั้ง 5 แห่งให้ครบ',
    objectivesList: [
      { id: 'browser_station', description: 'สำรวจสถานี Browser Station', isCompleted: false },
      { id: 'web_server_station', description: 'สำรวจสถานี Web Server', isCompleted: false },
      { id: 'web_page_station', description: 'สำรวจสถานี Web Page', isCompleted: false },
      { id: 'homepage_station', description: 'สำรวจสถานี Homepage', isCompleted: false },
      { id: 'url_board_station', description: 'สำรวจป้ายบอกพิกัด URL Board', isCompleted: false },
    ],
    taskType: 'EXPLORATION',
    rewardXP: 300,
    rewardStar: 1,
    rewardKey: 'Web Key',
    rewardBadge: 'Web Explorer',
    unlockArea: 'network_gateway',
    completionCondition: 'ค้นพบและตอบคำถามสถานีครบทั้ง 5 จุด',
    state: 'NotStarted'
  },
  {
    questId: 'M02',
    questName: 'MISSION 02: Deliver the Data Packet',
    areaId: 'network_gateway',
    npcId: 'npc_router',
    objective: 'นำส่ง Data Packet ตามลำดับ Browser → DNS → Server → Response → Website',
    objectivesList: [
      { id: 'packet_step1', description: 'เริ่มจาก Browser ส่งคำขอ URL', isCompleted: false },
      { id: 'packet_step2', description: 'สอบถามที่อยู่ IP จาก DNS Tower', isCompleted: false },
      { id: 'packet_step3', description: 'ส่ง Request สู่ Web Server', isCompleted: false },
      { id: 'packet_step4', description: 'รับ HTML Response และ Render สู่หน้าจอ', isCompleted: false }
    ],
    taskType: 'PACKET_DELIVERY',
    rewardXP: 450,
    rewardStar: 2,
    rewardKey: 'Network Key',
    rewardBadge: 'Network Navigator',
    unlockArea: 'html_factory',
    completionCondition: 'ส่ง Data Packet ตามลำดับถูกต้องโดยไม่มี Connection Error',
    state: 'NotStarted'
  },
  {
    questId: 'M03',
    questName: 'MISSION 03: Restore HTML Factory',
    areaId: 'html_factory',
    npcId: 'npc_factory_chief',
    objective: 'จับคู่ Tag กับหน้าที่ให้ตรงตามแผนกสายการผลิต',
    objectivesList: [
      { id: 'tag_h1', description: 'จับคู่ <h1> กับ Heading', isCompleted: false },
      { id: 'tag_p', description: 'จับคู่ <p> กับ Paragraph', isCompleted: false },
      { id: 'tag_img', description: 'จับคู่ <img> กับ Image', isCompleted: false },
      { id: 'tag_a', description: 'จับคู่ <a> กับ Link', isCompleted: false },
      { id: 'tag_ul', description: 'จับคู่ <ul>, <li> กับ List', isCompleted: false }
    ],
    taskType: 'TAG_MATCH',
    rewardXP: 600,
    rewardStar: 3,
    rewardKey: 'HTML Key',
    rewardBadge: 'HTML Builder',
    unlockArea: 'structure_lab',
    completionCondition: 'จับคู่แท็กสำเร็จครบทุกแผนกและทำ Code Combo',
    state: 'NotStarted'
  },
  {
    questId: 'M04',
    questName: 'MISSION 04: Rebuild the HTML Core',
    areaId: 'structure_lab',
    npcId: 'npc_lab_scientist',
    objective: 'เก็บ HTML Blocks ที่กระจัดกระจายและประกอบคืนสู่ HTML Core',
    objectivesList: [
      { id: 'core_doctype', description: 'ประกอบ <!DOCTYPE html>', isCompleted: false },
      { id: 'core_html', description: 'ประกอบแท็ก <html lang="th">', isCompleted: false },
      { id: 'core_head', description: 'ประกอบ <head> และ <title>', isCompleted: false },
      { id: 'core_body', description: 'ประกอบ <body> พร้อมเนื้อหา', isCompleted: false }
    ],
    taskType: 'STRUCTURE_BUILD',
    rewardXP: 750,
    rewardStar: 3,
    rewardKey: 'Structure Key',
    rewardBadge: 'Structure Master',
    unlockArea: 'tag_arena',
    completionCondition: 'ความสมบูรณ์ HTML CORE 100% พร้อม Live Preview',
    state: 'NotStarted'
  },
  {
    questId: 'M05',
    questName: 'MISSION 05: Tag Battle',
    areaId: 'tag_arena',
    npcId: 'npc_arena_master',
    objective: 'ใช้สกิล HTML Tag โจมตี Bug Monster และทำคะแนน Critical Code',
    objectivesList: [
      { id: 'battle_lvl1', description: 'ปราบ Monster ด้วย Basic Tags', isCompleted: false },
      { id: 'battle_lvl2', description: 'ปราบ Monster ด้วย Tags + Attributes', isCompleted: false },
      { id: 'battle_lvl3', description: 'ปราบ Boss ด้วย Nested HTML Tags', isCompleted: false }
    ],
    taskType: 'TAG_BATTLE',
    rewardXP: 900,
    rewardStar: 3,
    rewardKey: 'Arena Key',
    rewardBadge: 'Tag Master',
    unlockArea: 'debug_district',
    completionCondition: 'ชนะการประลองทั้ง 3 ระดับ',
    state: 'NotStarted'
  },
  {
    questId: 'M06',
    questName: 'MISSION 06: Bug Hunter',
    areaId: 'debug_district',
    npcId: 'npc_resident',
    objective: 'ตรวจสอบโค้ดที่เสียหายในเขต Glitch แก้ไข Syntax ให้ถูกต้องเพื่อฟื้นฟูระบบไฟฟ้าและร้านค้า',
    objectivesList: [
      { id: 'bug_closing', description: 'แก้แท็กปิดผิดพลาดใน <h1>', isCompleted: false },
      { id: 'bug_img_href', description: 'แก้ไข src/href สลับกันใน <img>', isCompleted: false },
      { id: 'bug_link_src', description: 'แก้ไข src/href ใน <a>', isCompleted: false }
    ],
    taskType: 'BUG_HUNT',
    rewardXP: 1100,
    rewardStar: 3,
    rewardKey: 'Debug Key',
    rewardBadge: 'Bug Hunter',
    unlockArea: 'creator_tower',
    completionCondition: 'แก้บั๊กครบ 3 จุดและลบล้าง Glitch Effect สำเร็จ',
    state: 'NotStarted'
  },
  {
    questId: 'M07',
    questName: 'FINAL MISSION: Build Your Website',
    areaId: 'creator_tower',
    npcId: 'npc_tower_mentor',
    objective: 'สร้างเว็บไซต์ Portfolio แนะนำตนเองด้วย HTML โครงสร้างมาตรฐาน ผ่านเกณฑ์การตรวจ Rule Engine',
    objectivesList: [
      { id: 'final_doctype', description: 'มีโครงสร้าง <!DOCTYPE html>, html, head, body', isCompleted: false },
      { id: 'final_heading', description: 'มีหัวข้อชื่อของตนเองด้วย <h1>', isCompleted: false },
      { id: 'final_paragraph', description: 'มีย่อหน้าแนะนำตัวและประวัติด้วย <p>', isCompleted: false },
      { id: 'final_image', description: 'มีรูปโปรไฟล์ด้วย <img> พร้อม alt attribute', isCompleted: false },
      { id: 'final_list', description: 'มีรายการทักษะความสนใจด้วย <ul>, <li>', isCompleted: false },
      { id: 'final_link', description: 'มีลิงก์ติดต่อภายนอกด้วย <a> พร้อม href', isCompleted: false }
    ],
    taskType: 'FINAL_WEBSITE',
    rewardXP: 2000,
    rewardStar: 5,
    rewardBadge: 'Web Creator',
    completionCondition: 'ผ่านการตรวจสอบโค้ดครบทุกข้อใน Checklist',
    state: 'NotStarted'
  }
];

export const BADGES_LIST: Badge[] = [
  {
    id: 'Web Explorer',
    name: 'Web Explorer',
    description: 'ผู้ค้นพบและเข้าใจ 5 เสาหลักของเว็บไซต์ใน Web Central',
    icon: '🧭'
  },
  {
    id: 'Network Navigator',
    name: 'Network Navigator',
    description: 'ผู้เชี่ยวชาญเส้นทาง Client-Server และ HTTP Request/Response',
    icon: '🌐'
  },
  {
    id: 'HTML Builder',
    name: 'HTML Builder',
    description: 'ช่างประกอบแท็ก HTML ผู้ช่ำชอง',
    icon: '🧱'
  },
  {
    id: 'Structure Master',
    name: 'Structure Master',
    description: 'ปรมาจารย์แห่งโครงสร้างแกนกลาง HTML Document',
    icon: '🏛️'
  },
  {
    id: 'Tag Master',
    name: 'Tag Master',
    description: 'ผู้พิชิต Bug Monster ในสังเวียน Tag Arena',
    icon: '⚔️'
  },
  {
    id: 'Bug Hunter',
    name: 'Bug Hunter',
    description: 'ผู้กอบกู้เมือง Web City จาก Glitch และ Syntax Error',
    icon: '🔍'
  },
  {
    id: 'AI Explorer',
    name: 'AI Explorer',
    description: 'ผู้เข้าศึกษาแล็บ AI ร่วมกับ BYTE',
    icon: '🤖'
  },
  {
    id: 'Web Creator',
    name: 'Web Creator',
    description: 'สุดยอดนักพัฒนาเว็บไซต์ระดับ ปวช.1 ผู้สร้างสรรค์ผลงานจริง',
    icon: '👑'
  }
];
