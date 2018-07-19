if ('serviceWorker' in navigator)
{
	let registerSW = () => {
		navigator.serviceWorker.addEventListener('message', (event) => {
			if (!event.data)
			{
				return;
			}

			switch (event.data)
			{
				case 'reload-window':
					window.location.reload();
					break;
				default:
					// NOOP
					break;
			}
		});
	};
	if (document.readyState !== "complete")
	{
		window.addEventListener('load', registerSW);
	}
	else
	{
		registerSW();
	}
}