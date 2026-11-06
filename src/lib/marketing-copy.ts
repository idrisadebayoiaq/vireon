import type { MarketingSection } from "@/components/marketing-layout";

export const homeSections: MarketingSection[] = [
  {
    kicker: "The desk",
    title: "A short list, not a pile of vacancies",
    paragraphs: [
      "Vireon is built for people looking for work in Nigeria. Each morning the desk holds five to seven roles. If only three are strong, you get three. Weak matches are left off so the list stays worth opening.",
      "Two groups sit side by side. One uses your full profile. The other is work you can apply for with an O'level result, and that group stays after you add an ND, HND, or degree.",
    ],
    points: [
      "Profile matches use skills, city, and your highest confirmed certificate.",
      "O'level matches use credits, English, Mathematics, and the subjects on the slip.",
      "A role you already opened or applied to does not return the next day.",
    ],
  },
  {
    kicker: "Certificates",
    title: "The result slip fills the form, then you confirm it",
    paragraphs: [
      "You photograph a WAEC, NECO, or NABTEB slip. The reading is a draft. Nothing is saved as yours until you correct the subjects and grades and tap Confirm.",
      "A1 to C6 counts as a credit, D7 and E8 as a pass, F9 as a fail. A later certificate is added beside the first. The old result is not replaced.",
    ],
    points: [
      "Checker PINs are not collected.",
      "The slip stays in your private files.",
      "Employers see the confirmed grades only when you choose to put them on a resume.",
    ],
  },
  {
    kicker: "Resumes",
    title: "Ten ATS layouts, or a blank page you build",
    paragraphs: [
      "Pick a template aimed at entry work, NYSC, teaching, sales, care, operations, a graduate seat, a career switch, a compact professional resume, or a full CV. Each one is a single column with ordinary headings.",
      "You can also start from scratch, rename every heading, and add fields. A template and a blank page can both be written by the AI from your profile, then edited line by line.",
    ],
    points: [
      "No text inside images, tables, or sidebars.",
      "You add a field when a template is missing something you need.",
      "The PDF step comes later. The words are yours now.",
    ],
  },
  {
    kicker: "Applications",
    title: "The email is drafted here and sent only when you say so",
    paragraphs: [
      "If a role has a Gmail or other address, Vireon opens a composer with your chosen resume. You edit the subject and the body. Send is a separate tap, and in this build it does not leave the app yet.",
      "If the only route is the company's own page, you keep the resume ready and open that page yourself.",
    ],
    points: [
      "One draft per save, stored in Applications.",
      "Status can be moved by hand: draft, interview, offer, rejected.",
      "The same company is not mailed in a burst from every user.",
    ],
  },
  {
    kicker: "Employers",
    title: "A company posts the role and the address that should receive it",
    paragraphs: [
      "An employer adds the title, the city, the certificate rule, and the Gmail for applications. A cashier role that needs five credits including English and Mathematics lands in the O'level lane.",
      "Sample cards on the desk are labelled Sample. They are there so the product can be walked through before a live feed is connected.",
    ],
    points: [
      "O'level and no-certificate roles stay in the simple lane.",
      "ND, HND, and degree roles sit in the profile lane.",
      "The employer edits only the roles they posted.",
    ],
  },
  {
    kicker: "Where it runs",
    title: "Phone first, Lagos time, your account",
    paragraphs: [
      "The marketing site is public. The desk, certificates, resumes, and applications sit behind sign-in. This first release keeps that work in the browser session while the database tables are already in place.",
      "Daily timing is meant for 06:00 West Africa Time. Until that job runs on a schedule, Today shows the sample shortlist plus anything you post in the session.",
    ],
    points: [
      "Sign in from any page to open the dashboard.",
      "Settings holds alerts, the O'level lane, and account deletion.",
      "Privacy explains what is stored and when mail is allowed to leave.",
    ],
  },
];

export const howSections: MarketingSection[] = [
  {
    kicker: "Account",
    title: "Sign in, then fill the profile once",
    paragraphs: [
      "The account is the folder for everything else. Name, phone, state, LGA, city, NYSC status, skills, and work history are typed once.",
      "Resumes, match lines, and application drafts read that profile. You do not retype Ikeja or your WAEC year into every document.",
    ],
    points: [
      "State and LGA come from the Nigeria list.",
      "Skills have a level: beginner, comfortable, or strong.",
      "Experience can be a shop job, SIWES, or a school duty.",
    ],
  },
  {
    kicker: "Slip",
    title: "Upload the result, then correct the table",
    paragraphs: [
      "The upload asks for the exam body, the kind of certificate, the year, the exam number, and the file. The review screen opens with subjects and grades.",
      "In this build the first reading is a fixed sample so you can practise the confirm step. The live reading of a photograph is the next stage. Confirm is still required.",
    ],
    points: [
      "Add a subject the sample missed.",
      "Scan again restores the sample rows.",
      "A second certificate does not delete the first.",
    ],
  },
  {
    kicker: "Rules",
    title: "O'level matching is a rule, not a guess",
    paragraphs: [
      "A role stores the minimum: no certificate, O'level, ND, HND, or degree. For O'level it can require English, Mathematics, a credit count, and named subjects.",
      "Your confirmed grades are compared with that rule. A credit is A1, B2, B3, C4, C5, or C6. The desk can explain a match in one line and name a missing skill.",
    ],
    points: [
      "Warehouse work with no certificate still sits in the O'level group.",
      "A degree-only trainee seat stays out of that group.",
      "The filter on Jobs hides a lane when you ask it to.",
    ],
  },
  {
    kicker: "Morning list",
    title: "Up to four profile roles, then O'level fills the rest",
    paragraphs: [
      "The intended morning job takes up to four roles that fit the whole profile, then fills toward seven with simple roles that pass the O'level rule. Companies are spread so you do not see seven versions of the same sales job.",
      "Until that schedule is switched on, Today shows the labelled samples and any role you post during the session.",
    ],
    points: [
      "Seen and applied roles drop off.",
      "Remote roles can travel outside your state.",
      "A thin day says so, instead of padding the list.",
    ],
  },
  {
    kicker: "Writing",
    title: "Choose a template or start empty, then call the AI if you want",
    paragraphs: [
      "The new-document screen has ten templates and a from-scratch path. Both open the same editor. Every heading and paragraph can be changed. You can add a field the template did not include.",
      "Write with AI sends the profile, the confirmed certificates, and the headings you have. It returns plain text into those fields. You still edit before the document is used on an application.",
    ],
    points: [
      "The model does not invent a job you did not list.",
      "Extra fields you added are included in the request.",
      "Switching structure keeps text where the heading matches.",
    ],
  },
  {
    kicker: "Sending",
    title: "Draft, save, track. Sending waits for your Gmail",
    paragraphs: [
      "Apply by email opens To, subject, body, and the resume picker. Draft with my details writes a plain letter. Save draft puts it in Applications.",
      "The Send button explains that mail will go from your Gmail after that connection exists. It does not send. Open original posting shows the link, or tells you the employer only left an email.",
    ],
    points: [
      "Move a draft to Interview and it changes group.",
      "The tracker is manual. Replies are not detected yet.",
      "Delete account is confirmed in Settings and does not erase the auth user yet.",
    ],
  },
];

export const seekerSections: MarketingSection[] = [
  {
    kicker: "O'level lane",
    title: "Simple jobs stay visible after you earn a higher certificate",
    paragraphs: [
      "A lot of hiring in Nigeria still starts from WAEC, NECO, or NABTEB. Cashier, shop attendant, front desk, warehouse, customer service, dispatch, and factory work belong in that lane when the role's rule matches.",
      "Adding a degree does not hide those roles. The profile lane grows. The O'level lane remains, and you can turn it off in Settings if you no longer want it.",
    ],
    points: [
      "Five credits including English and Mathematics is a common rule.",
      "Some shop roles ask only for English.",
      "No-certificate work is listed with the simple roles.",
    ],
  },
  {
    kicker: "Grades",
    title: "Credits, passes, and fails are spelled out",
    paragraphs: [
      "Employers rarely mean 'any grade'. Vireon treats A1 to C6 as credit, D7 and E8 as pass, and F9 as fail. The review screen says this next to the table so a C6 is not confused with a distinction.",
      "You confirm the table. A misread subject is fixed by you, not by a second silent guess.",
    ],
    points: [
      "English Language and Mathematics are first-class requirements on many cards.",
      "Named subjects on the job are checked against the slip.",
      "Higher certificates use their own grade labels.",
    ],
  },
  {
    kicker: "Place",
    title: "State, LGA, and how far you will travel",
    paragraphs: [
      "Your profile stores state, LGA, and city. Jobs carry the same. A Lagos cashier is not offered as if it were in Sokoto.",
      "Remote and hybrid roles can sit outside your state. On-site roles should match where you are, unless you change the filter on the Jobs page.",
    ],
    points: [
      "All 36 states and the FCT are in the dropdown.",
      "LGA follows the state you pick.",
      "Salary is shown in naira on the card.",
    ],
  },
  {
    kicker: "Gaps",
    title: "Each card says why it matches and what is missing",
    paragraphs: [
      "A support role might match your credits and still need Excel. The card says that in one line instead of pretending you already qualify for every duty.",
      "That missing line is the start of a later course suggestion. For now it is honest text on the card.",
    ],
    points: [
      "Match reason is one or two sentences.",
      "Missing skills are named, not scored as a percentage.",
      "You can still open the role and decide.",
    ],
  },
  {
    kicker: "Documents",
    title: "A resume for a shop and a CV for a school are different documents",
    paragraphs: [
      "Keep more than one. The entry template is short. The full CV has room for referees and every programme. The NYSC template treats the service year as work.",
      "From-scratch is the same editor with three blank fields. Rename them. Add the ones a particular employer asked for, such as 'Expected salary' or 'Portfolio link'.",
    ],
    points: [
      "Ten templates, all single column.",
      "AI can write a template or a blank page.",
      "You choose which document is attached to an application.",
    ],
  },
  {
    kicker: "Control",
    title: "You see the letter before anyone else does",
    paragraphs: [
      "Nothing is mailed because a job appeared on Today. You open the role, draft, edit, and save. The tracker is yours to update when a human replies.",
      "Settings lets you silence the O'level group and turn the job-alert preference off. Those preferences stay with this browser session for now.",
    ],
    points: [
      "Sign out from the dashboard header.",
      "Privacy and delete live in Settings.",
      "Sample roles are marked so they are not mistaken for a live vacancy.",
    ],
  },
];

export const employerSections: MarketingSection[] = [
  {
    kicker: "Posting",
    title: "The role and the inbox are added together",
    paragraphs: [
      "From the dashboard, Post a job asks for the title, company, Gmail, state, city, work mode, employment type, salary, and description. The Gmail is the address a seeker will write to.",
      "You can also leave an apply link. If you leave only the email, the seeker is told there is no external page.",
    ],
    points: [
      "Full-time, internship, NYSC, apprenticeship, or contract.",
      "On-site, hybrid, or remote.",
      "The role shows on Jobs and on Today in the matching lane.",
    ],
  },
  {
    kicker: "Rules",
    title: "Say the certificate in the form, not only in the description",
    paragraphs: [
      "Choose none, O'level, ND, HND, degree, or a professional certificate. For O'level, tick English, tick Mathematics, set the credit count, and name subjects.",
      "That structure is what the desk uses. A sentence buried in the description is not enough for the filter.",
    ],
    points: [
      "None and O'level go to the simple lane.",
      "ND and above go to the profile lane.",
      "Required skills show up as the missing line when a seeker lacks them.",
    ],
  },
  {
    kicker: "Who sees it",
    title: "Seekers in the right state see the card the same day",
    paragraphs: [
      "A posted role is stored for the browser session in this build, and the database table is ready for the saved version. Seekers browsing Jobs can filter by state, work mode, and lane.",
      "A degree-only role disappears when someone filters to O'level. A cashier role remains.",
    ],
    points: [
      "Sample roles stay labelled.",
      "Your role does not carry the Sample tag.",
      "The match line tells the seeker the rule you set.",
    ],
  },
  {
    kicker: "Inbox",
    title: "Applications are letters, not a second login you must learn first",
    paragraphs: [
      "The seeker writes from their profile and attaches the resume they picked. When Gmail sending is connected, the letter comes from the seeker, so you can reply to them directly.",
      "Until then, the draft sits in their tracker. You will not receive a surprise mail from this build.",
    ],
    points: [
      "One application per seeker per role.",
      "A daily cap will stop a pile of identical letters.",
      "You are not asked to scrape or repost someone else's vacancy.",
    ],
  },
  {
    kicker: "Simple hiring",
    title: "O'level roles are a first-class posting, not an afterthought",
    paragraphs: [
      "If you are hiring a shop attendant in Surulere or a warehouse hand in Abeokuta, set the rule and stop there. You do not need to pretend the role needs a degree.",
      "Seekers who only have O'level still see you. Seekers with a degree can see you too, in the simple group.",
    ],
    points: [
      "Credit count can be zero when you require no certificate.",
      "City is free text so a town outside the LGA name still reads clearly.",
      "Salary can be a range in naira.",
    ],
  },
  {
    kicker: "Next",
    title: "Post from the dashboard when you are signed in",
    paragraphs: [
      "The public page explains the posting. The form itself is inside the dashboard so a stranger cannot drop a vacancy on the desk.",
      "Open the dashboard, then use Post a job on the profile page, or go straight to the employer form.",
    ],
    points: [
      "Sign in, then open Profile and follow Post a job.",
      "Or visit the employer screen from the dashboard after sign-in.",
      "Edit rights stay with the account that created the role.",
    ],
  },
];

export const pricingSections: MarketingSection[] = [
  {
    kicker: "Now",
    title: "The desk is free while the product is being built",
    paragraphs: [
      "There is no charge for the account, the certificate review, the daily sample list, the ten templates, the from-scratch editor, or the AI draft.",
      "Paying for a template pack or a larger rewrite allowance can come later. It is not switched on.",
    ],
    points: [
      "No card is required to sign in.",
      "Sample jobs are part of the free walkthrough.",
      "Employer posting in this build is free.",
    ],
  },
  {
    kicker: "Stays free",
    title: "The record of who you are should not be behind a paywall",
    paragraphs: [
      "Profile, confirmed certificates, and one working resume are the core. A person with only O'level should be able to see simple roles and write a one-page resume without paying.",
      "The O'level lane is not a premium filter.",
    ],
    points: [
      "Confirming a result stays free.",
      "The entry-role template stays free.",
      "Saving a draft application stays free.",
    ],
  },
  {
    kicker: "Later",
    title: "A paid tier, when it exists, is extra writing and extra layouts",
    paragraphs: [
      "The likely paid extras are more AI rewrites in a day, a larger template set, and a highlighted profile for employers. They are listed here so the shape is clear. You cannot buy them yet.",
      "Prices would be in naira. Nothing on this page is an offer.",
    ],
    points: [
      "Extra rewrites, not access to your own data.",
      "Extra templates, not the ten that ship now.",
      "Employer features for several open roles at once.",
    ],
  },
  {
    kicker: "Not for sale",
    title: "Result slips are not a product we sell",
    paragraphs: [
      "Certificate images and confirmed grades are there to match jobs and to fill a resume the user chose. They are not sold to marketers or to other companies as a list.",
      "An application email is sent only after the user taps Send, and only to the address on that role.",
    ],
    points: [
      "No sale of WAEC or NECO scans.",
      "No hidden send when a job is recommended.",
      "Delete account is on the Settings screen.",
    ],
  },
  {
    kicker: "Employers",
    title: "Companies are not billed in this release",
    paragraphs: [
      "Posting a role with a Gmail and a certificate rule costs nothing now. A later employer plan can cover more seats and a shared inbox. That plan is not on sale.",
      "If you are hiring this month, use the free form and treat the sample cards as the product tour, not as applicants.",
    ],
    points: [
      "One company Gmail per role.",
      "No fee to appear in the O'level lane.",
      "No sponsored ranking in this build.",
    ],
  },
  {
    kicker: "Questions",
    title: "What you can count on today",
    paragraphs: [
      "You can read the five public pages, sign in, and use the dashboard. The AI resume draft calls OpenRouter from the server when you tap Write with AI. Job collection from other sites and Gmail sending are not live.",
      "If a control says the next stage, it is telling the truth. The screen is there so the path is clear before that connection is turned on.",
    ],
    points: [
      "Marketing pages are public.",
      "Dashboard pages ask you to sign in.",
      "The env file on the server holds the model key. The browser does not.",
    ],
  },
];
