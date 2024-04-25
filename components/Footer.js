
export default function Footer() {
  return (
    <footer className="max-w-screen-xl mx-auto p-4 text-sm">
      <div className="mb-8">
        <hr className="hidden dark:block sm:mx-auto border-mc-gray" />
      </div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <p>Powered by <a href="https://api.hypixel.net/" target="_blank" className="underline cursor-pointer">Hypixel's Public API</a></p>
        <div className="flex mt-4 space-x-5 sm:justify-center sm:mt-0">
          <div className="sm:text-end">© 2024 <a href="https://evelynnchen.com/" target="_blank" className="underline cursor-pointer">Evelynn Chen</a> 
          </div>
        </div>
      </div>
    </footer>
  );
};