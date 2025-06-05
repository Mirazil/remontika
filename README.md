# Remontika

Remontika is my personal graduation project, implemented using Next.js, Tailwind CSS, and Firebase (Functions, Storage, Authentication) with Telegram API integration. The project is deployed on Vercel.

This repository hosts a modern landing page that presents complete information about the service and explains its workflow. The primary focus of the project is the fully functional user dashboard: registered users can create repair requests, configure their profile settings, and choose how they wish to receive notifications. Whenever the status of a repair request changes, the new status is reflected in real time on the website. At the same time, users receive an automatic notification via a Telegram bot informing them of the update.

All source code, configuration files, and deployment scripts can be found here. Feel free to explore the implementation details of Next.js pages, Tailwind CSS styling, Firebase Functions for backend logic, and Telegram API integration for messaging. You can view the live application at https://remontika.vercel.app/


todo:
- [x] add background blurred shadow for all elements
- [x] add to dashboard/notify red "delete link" button
- [x] add to 4th step status bar
- [x] hide "show all orders" button if there are no orders
- [x] in "show all orders" hide uncompleted orders, show only completed
- [x] in "show all orders" show as many orders as screen can keep with no scroll
- [x] add bot link status in dashboard/notify
- [x] show bot link status in steps
- [x] add Spinner indication of loading after 6step
- [x] mobile version for dashboard/settings
- [x] mobile version for dashboard/notify
- [x] fix small images for viber/sms buttons in mobile version
- [x] add burger button for side panel
- [x] mobile version for dashboard orders
- [x] change telegram text
- [x] catch bug, when user link bot and dont get any status updates
- [x] fix small viber/sms icons on step3
- [x] fix small mb in steps for mobile
- [x] fix excess margin in orders on desktop
- [x] fix mobile version of all requests for admin account
- [x] fix dashboard/settings input form and right buttons size
- [x] fix admin account side panel (reloading page cause bug)
- [x] fix admin account mobile version order margin
- [ ] add /n to empty repair orders page between sentences
- [x] add link bot button and bot status on the step 4 from dashboard/notify  
- [ ] fix bug with linking telegram bot on iphones
