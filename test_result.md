#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: |
  MedUZ AI - Investor Demo MVP V2 Upgrade. Do NOT rebuild. Preserve all current design (palette, gradients, cards).
  Required V2 improvements (priority order):
    P0:
      - Fix AI Chat usability completely. Input field must always remain visible above keyboard. Chat should work like ChatGPT.
      - Replace current logo with premium MedUZ AI medical-tech jellyfish logo (SVG).
      - Replace English medical specialties with Uzbek terminology (Kardiolog, Pediatr, etc.).
    P1:
      - Dedicated Doctor Profile screen (Education + Certificates + Workplaces with Primary tag) before booking.
      - Organization profile improvements (Doctors/Departments/Reviews tabs, call/route/book footer).
      - Better doctor-clinic relationships (same doctor across multiple orgs, both public and private).
      - Home Care enhancements: gender preference, specialist preview (photo, rating, reviews), dynamic ETA per service.
    P2:
      - Advanced pharmacy search (24/7 + Delivery badges, per-pharmacy price, Reserve/Order actions).
      - Medical services expansion (Diagnostics + Procedures sub-tabs).
      - Additional investor-ready polish.

backend:
  - task: "POST /api/ai/chat - Claude Sonnet 4.5 multilingual responses"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: true
          agent: "main"
          comment: "Verified by recent backend logs - 200 OK on /api/ai/chat with Claude Sonnet 4.5."

  - task: "POST /api/home-visits - Home care request persistence"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: true
          agent: "main"
          comment: "Verified by backend logs - 200 OK after home-care submission from updated UI (with gender_preference + eta_minutes payload)."

  - task: "POST /api/appointments - Booking persistence"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
        - working: true
          agent: "main"
          comment: "Already working from V1. No changes."

  - task: "POST /api/auth/mock-login - Mocked phone+OTP and Google login"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
        - working: true
          agent: "main"
          comment: "Multiple successful auth calls in logs."

frontend:
  - task: "Premium SVG Jellyfish logo (replaces icon-based placeholder)"
    implemented: true
    working: true
    file: "src/components/ui.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: true
          agent: "main"
          comment: "Verified on screen — appears on Language, Auth, Role and AI Chat screens with gradient ring + tentacles + medical cross."

  - task: "Uzbek localized specialties in demo data"
    implemented: true
    working: true
    file: "src/data/demo.ts"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: true
          agent: "main"
          comment: "Doctors list shows Kardiolog, Pediatr, Nevrolog, Dermatolog, etc."

  - task: "AI Chat ChatGPT-style keyboard handling"
    implemented: true
    working: true
    file: "app/(patient)/ai-chat.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: true
          agent: "main"
          comment: "Uses KeyboardStickyView from react-native-keyboard-controller. Input always pinned to bottom. Needs final verification on physical device/Expo Go, but web preview shows correct sticky layout."

  - task: "Home Care V2 — gender preference + specialist preview + dynamic ETA"
    implemented: true
    working: true
    file: "app/(patient)/home-care.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: true
          agent: "main"
          comment: "Verified end-to-end - dynamic 'Nurse will arrive in 39 minutes' success state with specialist photo, rating (4.9 · 121), 8 yrs exp, Call/Message/Track actions. Gender chips update ETA range and matched specialist live."

  - task: "Doctor Profile — Education + Certificates + Workplaces (Primary tag)"
    implemented: true
    working: true
    file: "app/(patient)/doctor/[id].tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: true
          agent: "main"
          comment: "Verified - Dr. Akmal Karimov shows: Workplaces (Andijan Regional Hospital + Medion Private Clinic with Primary badge), Education (Doctor of Medicine 2008 + Interventional Cardiology Fellowship 2011), Certificates (Board Cert Cardiology, ESC Member, ACLS), Reviews."

  - task: "Organization profile — Doctors/Departments/Reviews tabs + doctor-org linkage"
    implemented: true
    working: true
    file: "app/(patient)/organization/[id].tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: true
          agent: "main"
          comment: "Verified - Andijan Regional Hospital lists Dr. Akmal Karimov + Dr. Jasur Mamatov. Call/Route/Book footer functional."

  - task: "Pharmacy + Medicine advanced search (24/7 + Delivery + Reserve)"
    implemented: true
    working: true
    file: "app/(patient)/pharmacies.tsx, app/(patient)/medicine/[id].tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: true
          agent: "main"
          comment: "Verified - pharmacy cards show 24/7 + Delivery (with ETA minutes) + Open badges + Call/Route/Order actions. Medicine detail shows per-pharmacy price (10k), 24/7, delivery, Reserve + Delivery action buttons."

  - task: "Medical Services — Diagnostics + Procedures sub-tabs"
    implemented: true
    working: true
    file: "app/(patient)/services.tsx"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
        - working: true
          agent: "main"
          comment: "Verified - 3 tabs (Mutaxassislar/Diagnostika/Muolajalar). Diagnostics: MRT, KT, UZI, Rentgen, EKG, EXOKG, Endoskopiya. Procedures: Inyeksiya, Kapelnitsa, Bog'lov, Reabilitatsiya, Postoperatsion parvarish."

metadata:
  created_by: "main_agent"
  version: "2.0"
  test_sequence: 2
  run_ui: false

test_plan:
  current_focus:
    - "AI Chat ChatGPT-style keyboard handling"
    - "Home Care V2 — gender preference + specialist preview + dynamic ETA"
    - "Doctor Profile — Education + Certificates + Workplaces (Primary tag)"
    - "Organization profile — Doctors/Departments/Reviews tabs + doctor-org linkage"
    - "Pharmacy + Medicine advanced search (24/7 + Delivery + Reserve)"
    - "Medical Services — Diagnostics + Procedures sub-tabs"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
    - agent: "main"
      message: |
        V2 upgrades complete. All V1 features intact. Key V2 changes shipped:

        1. AI Chat now uses react-native-keyboard-controller (KeyboardStickyView). Input bar sticks above keyboard. JellyfishLogo on welcome screen.
        2. Home Care: gender preference (Any/Male/Female), specialist preview card with photo+rating+reviews+ETA badge, dynamic ETA per service ("Nurse will arrive in 39 minutes"), Call/Message/Track quick actions.
        3. Doctor profile: Education + Certificates sections, Workplaces with "Primary" tag.
        4. Organization profile: Doctors/Departments/Reviews tabs, Call/Route/Book footer.
        5. Pharmacy: 24/7 + Delivery (with ETA min) + Open badges + Call/Route/Order action buttons.
        6. Medicine detail: per-pharmacy specific price, 24/7+Delivery badges, Reserve + Delivery actions.
        7. Medical Services: 3-tab navigation (Mutaxassislar/Diagnostika/Muolajalar).

        Mock login credentials: any phone + any 4-digit OTP OR tap "Continue with Google". See /app/memory/test_credentials.md.

        Please run end-to-end frontend test focusing on the test_plan tasks above. Backend tests should validate /api/ai/chat, /api/home-visits, /api/appointments, /api/auth/mock-login.
