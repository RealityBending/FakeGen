// demographics.js  –  FakeGen experiment
// Adapted from FictionEro/study2/experiment/demographics.js

// Fullscreen ======================================================================
var fullscreen_text   = "<p>The experiment will switch to full-screen mode when you press the button below.</p>"
var fullscreen_button = "Continue"

var fullscreen_on = {
    type: jsPsychFullscreen,
    message: fullscreen_text,
    button_label: fullscreen_button,
    fullscreen_mode: true,
    delay_after: 0,
}

var fullscreen_off = {
    type: jsPsychFullscreen,
    message: fullscreen_text,
    button_label: fullscreen_button,
    fullscreen_mode: false,
}

// Browser info ======================================================================
var demographics_browser_info = {
    type: jsPsychBrowserCheck,
    data: {
        screen: "browser_info",
        date: new Date().toLocaleDateString("fr-FR"),
        time: new Date().toLocaleTimeString("fr-FR"),
    },
    on_finish: function (data) {
        dat = jsPsych.data.get().filter({ screen: "browser_info" }).values()[0]
        data["screen_height"] = dat["height"]
        data["screen_width"]  = dat["width"]

        let urlvars = jsPsych.data.urlVariables()
        data["researcher"]   = urlvars["exp"]
        data["sona_id"]      = urlvars["sona_id"]
        data["prolific_id"]  = urlvars["PROLIFIC_PID"]
        data["study_id"]     = urlvars["STUDY_ID"]
        data["session_id"]   = urlvars["SESSION_ID"]
    },
}

// Consent ===========================================================
var demographics_consent = {
    type: jsPsychSurvey,
    survey_json: {
        showQuestionNumbers: false,
        completeText: "Continue",
        pages: [
            {
                elements: [
                    {
                        type: "html",
                        name: "consent_info",
                        html: `
                            <img src='https://blogs.brighton.ac.uk/sussexwrites/files/2019/06/University-of-Sussex-logo-transparent.png' width='150px' align='right'/>
                            <br><br><br><br><br>
                            <h1>Informed Consent</h1>

                            <p align='left'><b>Invitation to Take Part</b><br>
                            Thank you for considering participating in this study on human perception of images.
                            This study is conducted by Dr Dominique Makowski and his team at the <b>University of Sussex</b>.
                            Please contact us if you have any questions (see contact details below).</p>

                            <p align='left'><b>Why have I been invited and what will I do?</b><br>
                            The goal is to study how different categories of images make us feel and think.
                            You will be shown a series of images (faces, artworks, chat screenshots, and erotic photographs) and asked to rate them on different dimensions (e.g., beauty, arousal).
                            The whole experiment will take approximately <b style='color:green;'>~XX min</b>.
                            Please ensure you are in a <b>quiet environment</b> and can complete it in one sitting.</p>

                            <p align='left'><b>What will happen to the results and my personal information?</b><br>
                            Results may be published in a scientific article. Your anonymity will be fully preserved.
                            <b>Please read and tick each consent statement below carefully.</b></p>

                            <p align='left'><b>Contact for Further Information</b><br>
                            If you have any problems, concerns or questions about this study, you should get in touch with Dr Dominique Makowski (<i style='color:DodgerBlue;'>d.makowski@sussex.ac.uk</i>) or Ana Neves (<i style='color:DodgerBlue;'>a.neves@sussex.ac.uk</i>). 
                            If you have any concerns about the way in which the study has been conducted, you should contact the SEMSET Faculty Research Ethics Committee at <i style='color:DodgerBlue;'>frecsemset@sussex.ac.uk</i>.               
                            
                            <p align='left'><b>Insurance</b><br></p>
                            University of Sussex has insurance in place to cover its legal liabilities in respect of this study.

                            <p align='left'><b>Consent</b></p>
                        `,
                    },
                    {
                        type: "checkbox",
                        name: "consent_statements",
                        title: "Please tick each box to indicate that you have read and agree with each statement.",
                        choices: [
                            "I have read and understood the information above, a copy of which I may keep for my records.",
                            "I understand that my participation is entirely voluntary and that I can withdraw at any stage.",
                            "I understand that since the study is anonymous, it will be impossible to withdraw my data once completed.",
                            "I understand that my personal data will be handled in accordance with Data Protection legislation and the University's Privacy Notice.",
                            "I understand that de-identified data may be made publicly available through secured scientific repositories.",
                            "Due to the explicit nature of some images, I confirm that I am 18 years of age or older.",
                            "I agree to follow the instructions and provide honest answers. Non-valid responses (random patterns, instructions not read) may result in withheld credit.",
                        ],
                        isRequired: true,
                        validators: [
                            {
                                type: "answercount",
                                minCount: 7,
                                maxCount: 7,
                                text: "You must agree to all statements before continuing.",
                            },
                        ],
                    },
                    {
                        type: "checkbox",
                        name: "consent_final",
                        title: "By participating, you agree to follow the instructions and provide honest answers. If you do not wish to participate, simply close your browser.",
                        choices: [
                            "I consent to taking part in this study.",
                        ],
                        isRequired: true,
                    },
                    
                ],
            },
        ],
    },
    data: { screen: "consent" },
}

// Demographic questions ====================================================
var demographics_questions = {
    type: jsPsychSurvey,
    survey_json: {
        title: "About yourself",
        completeText: "Continue",
        pageNextText: "Next",
        pagePrevText: "Previous",
        goNextPageAutomatic: false,
        showQuestionNumbers: false,
        pages: [
            {
                elements: [
                    {
                        title: "What is your gender?",
                        name: "Gender",
                        type: "radiogroup",
                        choices: ["Male", "Female", "Other"],
                        isRequired: true,
                        colCount: 0,
                    },
                    {
                        type: "text",
                        title: "Please enter your age (in years)",
                        name: "Age",
                        isRequired: true,
                        inputType: "number",
                        min: 18,
                        max: 100,
                        placeholder: "e.g., 21",
                    },
                ],
            },
            {
                elements: [
                    {
                        title: "What is your highest completed education level?",
                        name: "Education",
                        type: "radiogroup",
                        choices: [
                            { value: "Doctorate",         text: "University (doctorate)" },
                            { value: "Master",            text: "University (master)" },
                            { value: "Bachelor",          text: "University (bachelor)" },
                            { value: "High school",       text: "High school" },
                            { value: "Elementary school", text: "Elementary school" },
                        ],
                        showOtherItem: true,
                        otherText: "Other",
                        otherPlaceholder: "Please specify",
                        isRequired: true,
                        colCount: 1,
                    },
                    {
                        visibleIf: "{Education} == 'Doctorate' || {Education} == 'Master' || {Education} == 'Bachelor'",
                        title: "What is your discipline?",
                        name: "Discipline",
                        type: "radiogroup",
                        choices: [
                            "Arts and Humanities",
                            "Literature, Languages",
                            "History, Archaeology",
                            "Sociology, Anthropology",
                            "Political Science, Law",
                            "Business, Economics",
                            "Psychology, Neuroscience",
                            "Medicine",
                            "Biology, Chemistry, Physics",
                            "Mathematics, Physics",
                            "Engineering, Computer Science",
                        ],
                        showOtherItem: true,
                        otherText: "Other",
                        otherPlaceholder: "Please specify",
                    },
                    {
                        visibleIf: "{Education} == 'High school' || {Education} == 'Master' || {Education} == 'Bachelor'",
                        title: "Are you currently a student?",
                        name: "Student",
                        type: "boolean",
                        swapOrder: true,
                        isRequired: true,
                    },
                ],
            },
            {
                elements: [
                    {
                        title: "How would you describe your ethnicity?",
                        name: "Ethnicity",
                        type: "radiogroup",
                        choices: [
                            "White",
                            "Black",
                            "Hispanic/Latino",
                            "Middle Eastern/North African",
                            "South Asian",
                            "East Asian",
                            "Southeast Asian",
                            "Mixed",
                            "Prefer not to say",
                        ],
                        showOtherItem: true,
                        otherText: "Other",
                        otherPlaceholder: "Please specify",
                        isRequired: false,
                        colCount: 1,
                    },
                    {
                        title: "In which country are you currently living?",
                        name: "Country",
                        type: "dropdown",
                        choicesByUrl: { url: "https://surveyjs.io/api/CountriesExample" },
                        placeholder: "e.g., France",
                        isRequired: false,
                    },
                ],
            },
            {
                elements: [
                    {
                        title: "What sexual orientation do you identify with?",
                        name: "SexualOrientation",
                        type: "radiogroup",
                        choices: ["Heterosexual", "Homosexual", "Bisexual"],
                        showOtherItem: true,
                        otherText: "Other",
                        otherPlaceholder: "Please specify",
                        isRequired: true,
                        colCount: 1,
                    },
                    {
                        title: "I am currently…",
                        name: "SexualStatus",
                        type: "radiogroup",
                        choices: [
                            "Single and not open to dating",
                            "Single and open to dating",
                            "In a relationship and not open to dating",
                            "In a relationship and open to dating",
                        ],
                        showOtherItem: true,
                        otherText: "Other",
                        otherPlaceholder: "Please specify",
                        isRequired: true,
                        colCount: 1,
                    },
                ],
            },
        ],
    },
    data: { screen: "demographic_questions" },
}

// End-of-experiment feedback ========================================================
var experiment_feedback = {
    type: jsPsychSurvey,
    survey_json: {
        title: "Feedback",
        description:
            "This is the end of the experiment! Feel free to leave us a message. " +
            "After clicking 'Complete', your data will be saved, and we will provide more information about the study.",
        completeText: "Complete the experiment",
        showQuestionNumbers: false,
        pages: [
            {
                elements: [
                    {
                        type: "rating",
                        name: "Feedback_Enjoyment",
                        title: "Did you enjoy this experiment?",
                        isRequired: false,
                        rateMin: 0,
                        rateMax: 4,
                        rateType: "stars",
                    },
                    {
                        type: "comment",
                        name: "Feedback_Text",
                        title: "Anything else you would like to share with us?",
                        isRequired: false,
                    },
                ],
            },
        ],
    },
    data: { screen: "experiment_feedback" },
}

// Debriefing ===================================================================================
var demographics_debriefing = {
    type: jsPsychHtmlButtonResponse,
    css_classes: ["narrow-text"],
    stimulus:
        "<h2>Debriefing</h2>" +
        "<p align='left'>The purpose of this study was to examine how <b>AI model labels</b> (e.g. Midjourney, ChatGPT) versus <b>photograph labels</b> " +
        "affect the way people perceive and evaluate images. " +
        "Specifically, we were interested in whether believing that an image was produced by a particular AI system changes versus photograph change how they are rated. " +
        "Notably, all the images were real images." +
        "We apologise for the necessary deception and hope you understand its role in ensuring the validity of our experiment.</p>" +
        "<p align='left'><b>Thank you again!</b> Your participation is kept completely confidential. " +
        "If you have any questions, please contact " +
        "<i style='color:DodgerBlue;'>D.Makowski@sussex.ac.uk</i> or " +
        "<i style='color:DodgerBlue;'>A.Neves@sussex.ac.uk</i>.</p>" +
        "<p>Click <b>Continue</b> and <b>wait until your data have been successfully saved</b> before closing the tab.</p>",
    choices: ["Continue"],
    data: { screen: "debriefing" },
}

// ── End screen ───────────────────────────────────────────────
var demographics_endscreen = {
    type: jsPsychSurvey,
    survey_json: function () {
        let text =
            "<h2 style='color:green;'>Data saved successfully!</h2>" +
            "<p>Thank you for participating — it means a lot to us.</p>"

        if (jsPsych.data.urlVariables()["exp"] == "prolific") {
            text +=
                "<p><b style='color:red;'>After clicking 'End' you will be redirected to the Prolific reimbursement page.</b> " +
                "(You can also click <a href='https://app.prolific.com/submissions/complete?cc=XXXXXXXX'>here</a> directly.)</p>"
        }
        text += "<p><b>You can safely close this tab now.</b></p>"

        return {
            showQuestionNumbers: false,
            completeText: "End",
            pages: [
                {
                    elements: [
                        { type: "html", name: "Endscreen", html: text },
                    ],
                },
            ],
        }
    },
    data: { screen: "demographics_endscreen" },
}