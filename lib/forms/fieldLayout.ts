export function fieldLayout(grid: boolean) {
	return grid
		? {
				root: 'col-span-full grid grid-cols-subgrid items-center',
				label: 'text-right font-light',
				value: 'flex items-center',
			}
		: {
				root: 'flex py-1',
				label: 'mr-1 w-cardlabels font-light sm:w-smcardlabels',
				value: 'flex items-center',
			};
}
