<img width="3188" height="1202" alt="frame (3)" src="https://github.com/user-attachments/assets/517ad8e9-ad22-457d-9538-a9e62d137cd7" />


# Braincell counter 🎯


## Basic Details
- Name: Ananya Anil [SCMS School of Engineering and Technology]

### Project Description
A hilarious braincell counter disguised as a timer, this project is designed to count how many braincells one loses in the time interval the user set. A loss of a braincells results in some good old roasts for the soul.

### The Problem (that doesn't exist)
Well its an obvious fact we lose braincells for the most basic everyday tasks(that is if we're even running on functioning braincells than our dose of caffeine), so the problem that we face is losing the count of how many of them are lost.

### The Solution (that nobody asked for)
My solution is to build a counter or a tracker if you will, to keep an eye on those pesky little guys which is disguised as a basic timer which we can customize and see them go all the while being able to do absolutely nothing about it and get roasted to the core instead.

## Technical Details
### Technologies/Components Used
For Software:
- Languages used-> Python, HTML, CSS, JavaScript
- Frameworks used->Flask
- Libraries used->flask,Vanilla JS,anime.js,Howler.js
- Tools used->VS Code,Browser DevTools,v0


### Implementation
For Software:
# 1. Create virtual environment
python -m venv venv

# 2. Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# 3. Install dependencies
pip install flask animejs howler

# (Optional: If you want to store braincells in SQLite via Flask)
pip install flask_sqlalchemy

# Run
# Start Flask server
python app.py
http://127.0.0.1:5000

### Project Documentation
For Software:
The Braincell Counter App is a humorous, interactive web app that removes one braincell every time the user interacts with it. The app responds dynamically based on the remaining braincells:

>5 Braincells: Motivational messages.

3–5 Braincells: UI shake + sarcastic messages.

1–2 Braincells: Sad violin + floating brain animation.

0 Braincells: Full chaos mode (screen flips, grayscale, whispers).

The count persists between sessions using local storage + Flask backend.

# Features
Persistent Braincell Count (localStorage + SQLite backup)

Dynamic Messages based on braincell count

Interactive Animations (UI shake, flips, floating braincells)

Sound Effects (Howler.js)

Customizable Braincell Timer

“Premium Brick” fake ad

Push Notifications with regret messages



# Screenshots (Add at least 3)
# screenshots are from how it is run in v0 with all the same features.
!<img width="944" height="615" alt="Screenshot 2025-08-09 052141" src="https://github.com/user-attachments/assets/8b3f9c25-75b8-48a7-baaa-9aa390622df8" />
-This image shows the v0 version of what the product would look like. It starts wit!
h the timer that shows the different modes- currently in productivity mode.

!<img width="999" height="475" alt="Screenshot 2025-08-09 053250" src="https://github.com/user-attachments/assets/221c57c5-b974-4231-b82d-d11214b1a47f" />
-This shows the popup roast feature at regular intervals.

<img width="718" height="515" alt="Screenshot 2025-08-09 053430" src="https://github.com/user-attachments/assets/46b81105-43b6-4d2a-82c4-db59b0fd0690" />
-Once all the braincells are lost the entire screen flips and goes upside down whereas a singular message is upright giving a final roast.

# screenshots after running using vscode
<img width="1314" height="505" alt="Screenshot 2025-08-09 055822" src="https://github.com/user-attachments/assets/99e56918-03a9-4bab-bebc-fcfc2afe784c" />
-This is the first interface after lauching the code


<img width="1357" height="526" alt="Screenshot 2025-08-09 055851" src="https://github.com/user-attachments/assets/daf6e752-7a41-4cba-9047-3ff5e089ba0b" />
- A customisable timer with options to self-reflect or buy a brick (yes that's a thing)


<img width="1342" height="460" alt="Screenshot 2025-08-09 055916" src="https://github.com/user-attachments/assets/203f6af6-b5a4-4d09-a1ba-405a00fef785" />
-What happens when you want to check out the brick



# Additional Demos
-V0 link: [https://v0.dev/chat/braincell-app-features-sXK9ZM7yFcu]


---
Made with ❤️ at TinkerHub Useless Projects 

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)
![Static Badge](https://img.shields.io/badge/UselessProjects--25-25?link=https%3A%2F%2Fwww.tinkerhub.org%2Fevents%2FQ2Q1TQKX6Q%2FUseless%2520Projects)



