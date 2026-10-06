# Scale Street

Static diecast storefront for the Scale Street Instagram page.

## No backend

This project intentionally has no server, database, Firebase, Supabase, or realtime service.

## Customer store

Open `index.html`.

Customers can:
- Browse products
- Search/filter
- View product details
- Add/remove products in a persistent local cart
- Enter checkout details
- Receive a WhatsApp order message containing the selected products and total
- Use the configured UPI ID for payment

## Owner product manager

Open `admin.html`.

Add the real product information and product images. The manager stores the working catalogue in that browser's local storage.

When ready, click **Export website data**. This downloads a new `products.js`. Replace the existing `js/products.js` with the exported file, then publish the files to GitHub/Vercel.

## Important static-site limitation

Because there is no backend, product changes are not realtime and are not automatically shared between devices. Exporting/replacing `products.js` and republishing is required after catalogue changes.

## Configuration

The owner enters:
- WhatsApp number in international digits-only format
- UPI ID

Do not put UPI PINs, banking passwords, API secrets, or private credentials into the website.


## Stock status

Stock is controlled by the numeric Stock field:
- `1` or more = **In Stock**
- `0` = **Out Of Stock**

The status is shown on product cards, product details, and the owner product manager. Out-of-stock products cannot be added to the cart.

## Responsive support

The UI includes responsive layouts for phones, tablets, laptops, desktops, very wide displays, portrait/landscape screens, touch devices, and reduced-motion accessibility preferences.
