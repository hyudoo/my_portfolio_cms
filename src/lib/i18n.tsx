"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Language = "en" | "vi"

type TranslationKey = keyof typeof translations.en

const translations = {
  en: {
    // Navbar
    navHome: "Home",
    navSkills: "Skills",
    navProjects: "Projects",
    navAbout: "About",
    navBlog: "Blog",
    navContact: "Contact",
    hireMe: "Hire Me",
    
    // Hero
    heroAvailable: "Available for new opportunities",
    heroTitle1: "Building",
    heroTitle2: "digital experiences",
    heroTitle3: "that inspire",
    heroSubtitle: "Senior Fullstack Developer specializing in building exceptional digital experiences. Currently focused on building accessible, human-centered products.",
    viewProjects: "View Projects",
    downloadCV: "Download CV",
    contactMe: "Contact Me",
    yearsExperience: "Years Experience",
    projectsCompleted: "Projects Completed",
    youtubeSubscribers: "YouTube Subscribers",
    scrollDown: "Scroll down",
    
    // Skills
    skillsBadge: "Technical Skills",
    skillsTitle1: "My",
    skillsTitle2: "Tech Stack",
    skillsSubtitle: "A comprehensive overview of the technologies and tools I use to bring ideas to life",
    frontend: "Frontend",
    backend: "Backend",
    database: "Database",
    devops: "DevOps",
    tools: "Tools",
    alsoExperienced: "Also experienced with:",
    
    // Projects
    projectsBadge: "Portfolio",
    projectsTitle1: "Featured",
    projectsTitle2: "Projects",
    projectsSubtitle: "A selection of my recent work showcasing my skills in building modern web applications",
    allProjects: "All Projects",
    fullStack: "Full Stack",
    frontendCat: "Frontend",
    backendCat: "Backend",
    aiMl: "AI/ML",
    devopsCat: "DevOps",
    liveDemo: "Live Demo",
    demo: "Demo",
    code: "Code",
    
    // About
    aboutBadge: "About Me",
    aboutTitle1: "My",
    aboutTitle2: "Journey",
    aboutSubtitle: "A passionate developer with a love for creating beautiful, functional digital experiences",
    aboutP1: "I'm a Senior Fullstack Developer with over 8 years of experience building web applications that users love. My passion lies at the intersection of design and technology, where I create intuitive and performant digital experiences.",
    aboutP2: "Throughout my career, I've had the privilege of working with startups and established companies alike, helping them build products that scale. I believe in writing clean, maintainable code and staying current with the latest industry trends.",
    aboutP3: "When I'm not coding, you can find me creating content for my YouTube channel, contributing to open-source projects, or exploring new technologies. I'm always open to new opportunities and collaborations.",
    cleanCode: "Clean Code",
    qualityFirst: "Quality First",
    userFocus: "User Focus",
    experienceMatters: "Experience Matters",
    continuousLearning: "Continuous Learning",
    stayCurious: "Stay Curious",
    teamPlayer: "Team Player",
    collaborateGrow: "Collaborate & Grow",
    
    // Timeline
    timeline2024Title: "Senior Fullstack Developer",
    timeline2024Company: "Tech Startup Inc.",
    timeline2024Desc: "Leading development of scalable web applications, mentoring junior developers, and architecting cloud infrastructure.",
    timeline2021Title: "Fullstack Developer",
    timeline2021Company: "Digital Agency Co.",
    timeline2021Desc: "Built and maintained multiple client projects using React, Node.js, and various cloud services.",
    timeline2020Title: "AWS Certified Solutions Architect",
    timeline2020Company: "Amazon Web Services",
    timeline2020Desc: "Achieved professional certification for designing distributed systems on AWS.",
    timeline2018WorkTitle: "Frontend Developer",
    timeline2018WorkCompany: "Software Solutions Ltd.",
    timeline2018WorkDesc: "Developed responsive web applications and improved performance optimization strategies.",
    timeline2018EduTitle: "Bachelor in Computer Science",
    timeline2018EduCompany: "University of Technology",
    timeline2018EduDesc: "Graduated with honors, specialized in Software Engineering and Web Technologies.",
    
    // Blog
    blogBadge: "Technical Blog",
    blogTitle1: "Latest",
    blogTitle2: "Articles",
    blogSubtitle: "Sharing knowledge and insights about web development, DevOps, and software engineering",
    searchArticles: "Search articles...",
    all: "All",
    performance: "Performance",
    tutorial: "Tutorial",
    readMore: "Read more",
    viewAllArticles: "View All Articles",
    
    // Newsletter
    newsletterTitle1: "Stay",
    newsletterTitle2: "Updated",
    newsletterSubtitle: "Subscribe to my newsletter for the latest articles, tutorials, and insights on web development delivered straight to your inbox.",
    enterEmail: "Enter your email",
    subscribe: "Subscribe",
    subscribing: "Subscribing...",
    subscribed: "You're subscribed! Check your inbox to confirm.",
    noSpam: "No spam, unsubscribe at any time. By subscribing, you agree to our Privacy Policy.",
    
    // Contact
    contactBadge: "Get In Touch",
    contactTitle1: "Let's",
    contactTitle2: "Connect",
    contactSubtitle: "Have a project in mind or just want to chat? I'd love to hear from you.",
    workTogether: "Let's work together",
    contactDescription: "I'm currently available for freelance work and full-time opportunities. If you have a project that you want to get started, think you need my help with something, or just want to say hey, then get in touch.",
    email: "Email",
    location: "Location",
    locationValue: "Ho Chi Minh City, Vietnam",
    availability: "Availability",
    availabilityValue: "Open for opportunities",
    connectWithMe: "Connect with me",
    name: "Name",
    subject: "Subject",
    subjectPlaceholder: "Project Inquiry",
    message: "Message",
    messagePlaceholder: "Tell me about your project...",
    sendMessage: "Send Message",
    sending: "Sending...",
    messageSent: "Message Sent!",
    thankYou: "Thanks for reaching out. I'll get back to you as soon as possible.",
    sendAnother: "Send Another Message",
    
    // Footer
    navigation: "Navigation",
    resources: "Resources",
    resume: "Resume",
    legal: "Legal",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    footerDescription: "Building digital experiences that inspire and delight. Available for freelance and full-time opportunities.",
    allRightsReserved: "All rights reserved.",
    madeWith: "Made with",
    using: "using Next.js & Tailwind CSS",
  },
  vi: {
    // Navbar
    navHome: "Trang Chủ",
    navSkills: "Kỹ Năng",
    navProjects: "Dự Án",
    navAbout: "Giới Thiệu",
    navBlog: "Blog",
    navContact: "Liên Hệ",
    hireMe: "Thuê Tôi",
    
    // Hero
    heroAvailable: "Sẵn sàng cho cơ hội mới",
    heroTitle1: "Xây dựng",
    heroTitle2: "trải nghiệm số",
    heroTitle3: "đầy cảm hứng",
    heroSubtitle: "Lập trình viên Fullstack Senior chuyên xây dựng các trải nghiệm số xuất sắc. Hiện đang tập trung xây dựng các sản phẩm dễ tiếp cận, lấy con người làm trung tâm.",
    viewProjects: "Xem Dự Án",
    downloadCV: "Tải CV",
    contactMe: "Liên Hệ",
    yearsExperience: "Năm Kinh Nghiệm",
    projectsCompleted: "Dự Án Hoàn Thành",
    youtubeSubscribers: "Người Theo Dõi YouTube",
    scrollDown: "Cuộn xuống",
    
    // Skills
    skillsBadge: "Kỹ Năng Chuyên Môn",
    skillsTitle1: "Công Nghệ",
    skillsTitle2: "Của Tôi",
    skillsSubtitle: "Tổng quan về các công nghệ và công cụ tôi sử dụng để hiện thực hóa ý tưởng",
    frontend: "Frontend",
    backend: "Backend",
    database: "Cơ Sở Dữ Liệu",
    devops: "DevOps",
    tools: "Công Cụ",
    alsoExperienced: "Cũng có kinh nghiệm với:",
    
    // Projects
    projectsBadge: "Danh Mục",
    projectsTitle1: "Dự Án",
    projectsTitle2: "Nổi Bật",
    projectsSubtitle: "Tuyển chọn các công việc gần đây thể hiện kỹ năng xây dựng ứng dụng web hiện đại",
    allProjects: "Tất Cả Dự Án",
    fullStack: "Full Stack",
    frontendCat: "Frontend",
    backendCat: "Backend",
    aiMl: "AI/ML",
    devopsCat: "DevOps",
    liveDemo: "Xem Demo",
    demo: "Demo",
    code: "Mã Nguồn",
    
    // About
    aboutBadge: "Về Tôi",
    aboutTitle1: "Hành Trình",
    aboutTitle2: "Của Tôi",
    aboutSubtitle: "Một lập trình viên đam mê tạo ra các trải nghiệm số đẹp và chức năng",
    aboutP1: "Tôi là Lập trình viên Fullstack Senior với hơn 8 năm kinh nghiệm xây dựng các ứng dụng web được người dùng yêu thích. Niềm đam mê của tôi nằm ở giao điểm giữa thiết kế và công nghệ, nơi tôi tạo ra các trải nghiệm số trực quan và hiệu suất cao.",
    aboutP2: "Trong suốt sự nghiệp, tôi đã có vinh dự làm việc với cả các startup và công ty lớn, giúp họ xây dựng các sản phẩm có khả năng mở rộng. Tôi tin vào việc viết mã sạch, dễ bảo trì và luôn cập nhật các xu hướng công nghệ mới nhất.",
    aboutP3: "Khi không code, bạn có thể tìm thấy tôi đang tạo nội dung cho kênh YouTube, đóng góp cho các dự án mã nguồn mở, hoặc khám phá các công nghệ mới. Tôi luôn sẵn sàng cho các cơ hội và hợp tác mới.",
    cleanCode: "Mã Sạch",
    qualityFirst: "Chất Lượng Trước",
    userFocus: "Tập Trung Người Dùng",
    experienceMatters: "Trải Nghiệm Quan Trọng",
    continuousLearning: "Học Hỏi Liên Tục",
    stayCurious: "Luôn Tò Mò",
    teamPlayer: "Làm Việc Nhóm",
    collaborateGrow: "Hợp Tác & Phát Triển",
    
    // Timeline
    timeline2024Title: "Lập Trình Viên Fullstack Senior",
    timeline2024Company: "Tech Startup Inc.",
    timeline2024Desc: "Dẫn dắt phát triển ứng dụng web có khả năng mở rộng, hướng dẫn các lập trình viên junior và thiết kế hạ tầng cloud.",
    timeline2021Title: "Lập Trình Viên Fullstack",
    timeline2021Company: "Digital Agency Co.",
    timeline2021Desc: "Xây dựng và bảo trì nhiều dự án khách hàng sử dụng React, Node.js và các dịch vụ cloud.",
    timeline2020Title: "AWS Certified Solutions Architect",
    timeline2020Company: "Amazon Web Services",
    timeline2020Desc: "Đạt chứng chỉ chuyên nghiệp về thiết kế hệ thống phân tán trên AWS.",
    timeline2018WorkTitle: "Lập Trình Viên Frontend",
    timeline2018WorkCompany: "Software Solutions Ltd.",
    timeline2018WorkDesc: "Phát triển ứng dụng web responsive và cải thiện chiến lược tối ưu hiệu suất.",
    timeline2018EduTitle: "Cử Nhân Khoa Học Máy Tính",
    timeline2018EduCompany: "Đại Học Công Nghệ",
    timeline2018EduDesc: "Tốt nghiệp loại giỏi, chuyên ngành Kỹ Thuật Phần Mềm và Công Nghệ Web.",
    
    // Blog
    blogBadge: "Blog Kỹ Thuật",
    blogTitle1: "Bài Viết",
    blogTitle2: "Mới Nhất",
    blogSubtitle: "Chia sẻ kiến thức và góc nhìn về phát triển web, DevOps và kỹ thuật phần mềm",
    searchArticles: "Tìm kiếm bài viết...",
    all: "Tất Cả",
    performance: "Hiệu Suất",
    tutorial: "Hướng Dẫn",
    readMore: "Đọc thêm",
    viewAllArticles: "Xem Tất Cả Bài Viết",
    
    // Newsletter
    newsletterTitle1: "Cập Nhật",
    newsletterTitle2: "Tin Tức",
    newsletterSubtitle: "Đăng ký nhận bản tin để nhận các bài viết, hướng dẫn và thông tin mới nhất về phát triển web qua email.",
    enterEmail: "Nhập email của bạn",
    subscribe: "Đăng Ký",
    subscribing: "Đang đăng ký...",
    subscribed: "Đã đăng ký! Kiểm tra hộp thư để xác nhận.",
    noSpam: "Không spam, hủy đăng ký bất cứ lúc nào. Khi đăng ký, bạn đồng ý với Chính sách Bảo mật.",
    
    // Contact
    contactBadge: "Liên Hệ",
    contactTitle1: "Hãy",
    contactTitle2: "Kết Nối",
    contactSubtitle: "Có dự án trong đầu hoặc chỉ muốn trò chuyện? Tôi rất muốn nghe từ bạn.",
    workTogether: "Hãy làm việc cùng nhau",
    contactDescription: "Tôi hiện có thể nhận công việc freelance và cơ hội toàn thời gian. Nếu bạn có dự án muốn bắt đầu, cần sự giúp đỡ của tôi, hoặc chỉ muốn chào hỏi, hãy liên hệ.",
    email: "Email",
    location: "Địa Điểm",
    locationValue: "TP. Hồ Chí Minh, Việt Nam",
    availability: "Tình Trạng",
    availabilityValue: "Sẵn sàng cho cơ hội mới",
    connectWithMe: "Kết nối với tôi",
    name: "Họ Tên",
    subject: "Tiêu Đề",
    subjectPlaceholder: "Yêu Cầu Dự Án",
    message: "Tin Nhắn",
    messagePlaceholder: "Kể tôi nghe về dự án của bạn...",
    sendMessage: "Gửi Tin Nhắn",
    sending: "Đang gửi...",
    messageSent: "Đã Gửi!",
    thankYou: "Cảm ơn bạn đã liên hệ. Tôi sẽ phản hồi sớm nhất có thể.",
    sendAnother: "Gửi Tin Nhắn Khác",
    
    // Footer
    navigation: "Điều Hướng",
    resources: "Tài Nguyên",
    resume: "Sơ Yếu Lý Lịch",
    legal: "Pháp Lý",
    privacyPolicy: "Chính Sách Bảo Mật",
    termsOfService: "Điều Khoản Dịch Vụ",
    footerDescription: "Xây dựng trải nghiệm số truyền cảm hứng và thú vị. Sẵn sàng cho công việc freelance và cơ hội toàn thời gian.",
    allRightsReserved: "Bảo lưu mọi quyền.",
    madeWith: "Được tạo với",
    using: "bằng Next.js & Tailwind CSS",
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language
    if (saved && (saved === "en" || saved === "vi")) {
      setLanguage(saved)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
