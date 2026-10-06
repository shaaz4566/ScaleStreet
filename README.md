# Scale Street — Single Folder

All files are in this one folder for easy editing in VS Code.

- `index.html` — customer storefront
- `style.css` — storefront styling/responsive design
- `app.js` — cart, search, checkout and WhatsApp logic
- `products.js` — current catalogue/configuration
- `admin.html` — owner product manager
- `admin.css` — admin styling

## Owner workflow

1. Open `admin.html`.
2. Enter the real WhatsApp number and UPI ID.
3. Add real products, images, prices, details and stock.
4. Click **Export Updated index.html**.
5. Downloaded `index-updated.html` is a standalone customer website containing the current products, images, CSS and JavaScript.
6. Rename it to `index.html` when you want it to become the live customer page.
7. Upload/publish it.

Stock > 0 = In Stock. Stock = 0 = Out Of Stock. Out-of-stock items cannot be added to cart.

There is no backend, database, Firebase, Supabase, or realtime service.
