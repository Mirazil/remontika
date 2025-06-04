# Remontika

Remontika is my personal graduation project, implemented using Next.js, Tailwind CSS, and Firebase (Functions, Storage, Authentication) with Telegram API integration. The project is deployed on Vercel.

This repository hosts a modern landing page that presents complete information about the service and explains its workflow. The primary focus of the project is the fully functional user dashboard: registered users can create repair requests, configure their profile settings, and choose how they wish to receive notifications. Whenever the status of a repair request changes, the new status is reflected in real time on the website. At the same time, users receive an automatic notification via a Telegram bot informing them of the update.

All source code, configuration files, and deployment scripts can be found here. Feel free to explore the implementation details of Next.js pages, Tailwind CSS styling, Firebase Functions for backend logic, and Telegram API integration for messaging. You can view the live application at https://remontika.vercel.app/


todo:
[x] add background blurred shadow for all elements
2. add to dashboard/notify red "delete link" button
3. add to 4th step status bar
4. hide "show all orders" button if there are no orders
5. in "show all orders" hide uncompleted orders, show only completed
6. in "show all orders" show as many orders as screen can keep with no scroll
7. add bot link status in dashboard/notify
8. show bot link status in steps
9. add Spinner indication of loading after 6step 
10. add burger button for side panel
12. mobile version for dashboard/settings 
13. mobile version for dashboard/notify
11. in "show all orders" show as many orders as screen can keep with no scroll (expect for mobile show only 4)
14. fix small images for viber/sms buttons in mobile version
15. mobile version for dashboard orders
16. change telegram text
17. fix admin account side panel (reloading page cause bug)