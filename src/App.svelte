<script>
	export let name;
	var ruta = 'about';
	function setRuta(r){
ruta = r;
console.log(ruta)
	}
</script>

<main class="m-5 rounded-lg">
	<div class="container grid grid-cols-12 md:gap-5 justify-between mr-auto ml-auto max-w-screen-xl rounded-lg bg-slate-50">
		<div class="col-span-12">
			<nav class="mt-10 flex justify-center">
				<ul class="flex">
					<li class="">
						<button href="/" on:click={() => setRuta('about')} 
							class="border-3 border-pink-500 rounded-md flex justify-center h-12 hover:bg-pink-500 items-center px-3 mx-2 transition duration-700">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
								<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
							  </svg>								  
							<p>
								About
							</p> 
						</button>
					</li>
					<li class="">
						<button href="/" on:click={() => setRuta('resume')} 
							class="border-3 border-pink-500 rounded-md flex justify-center h-12 hover:bg-pink-500 items-center px-3 mx-2 transition duration-700">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
								<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
							  </svg>
							  <p>
								Resume
							  </p>								  
						</button>
					</li>
					<li class="">
						<button href="/" on:click={() => setRuta('works')} 
							class="border-3 border-pink-500 rounded-md flex justify-center h-12 hover:bg-pink-500 items-center px-3 mx-2 transition duration-700">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
								<path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
							  </svg>
							  <p>Works</p>								  
						</button>
					</li>
				</ul>
			</nav>
		</div>
		<div class="col-span-12 lg:col-span-4">
			<div class="w-full text-center p-5">
				<div class="flex justify-center py-4">
					<img src="" alt="" class="rounded-full w-32 h-32"/>
				</div>
				
				<strong>Web Developer</strong>
				<div class="bg-gray-100 px-2 mt-5 w-72 m-auto">
					<div class="flex py-2">
						<div class="flex items-center mr-3">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-pink-600">
							<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
						  </svg>		
						</div>			  
						<div class="ml-1 text-left">
							<p class="text-xs text-gray-500">Phone</p>
							<p>9514479026</p>
						</div>
					</div>
					<div class="flex py-2">
						<div class="flex items-center mr-3">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-pink-600">
								<path stroke-linecap="round" stroke-linejoin="round" d="M7.875 14.25l1.214 1.942a2.25 2.25 0 001.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 011.872 1.002l.164.246a2.25 2.25 0 001.872 1.002h2.092a2.25 2.25 0 001.872-1.002l.164-.246A2.25 2.25 0 0116.954 9h4.636M2.41 9a2.25 2.25 0 00-.16.832V12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 01.382-.632l3.285-3.832a2.25 2.25 0 011.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0021.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 002.25 2.25z" />
							  </svg>								  
						</div>			  
						<div class="ml-1 text-left">
							<p class="text-xs text-gray-500">Email</p>
							<p>lauraramos418@gmail.com</p>
						</div>
					</div>
					<div class="flex py-2">
						<div class="flex items-center mr-3">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-pink-600">
								<path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
								<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
							  </svg>																
						</div>			  
						<div class="ml-1 text-left">
							<p class="text-xs text-gray-500">Location</p>
							<p>Oaxaca de juarez</p>
						</div>
					</div>
					<div class="flex py-2">
						<div class="flex items-center mr-3">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-pink-600">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
							  </svg>															
						</div>			  
						<div class="ml-1 text-left">
							<p class="text-xs text-gray-500">Birthday</p>
							<p>27/05/1997</p>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="col-span-12 lg:col-span-8">
			<div>
				{#if ruta == 'about'}
					<div class="mt-10">
						<h1 class="text-4xl font-bold">About Me</h1>
						<p class="p-3 my-5 bg-zinc-100 rounded-md">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 p-2 bg-purple-200 rounded-md text-purple-800">
								<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
							  </svg>							  
							I am Laura, web developer from Mexico, Oaxaca. 
							I have experience in web design, coding and programing.
							My expertise lies within front-end web apps, and the main languages in my tech stack are 
							JavaScript, React, and of course HTML/CSS
						</p>
						<button class="rounded-full bg-pink-200 py-2 px-3 hover:bg-pink-300">Download CV</button>
						<div class="mt-5">
							<p class="">What can I do?</p>
							<h1 class="text-3xl font-bold">My Skills</h1>
							<div class="p-3 my-5 bg-zinc-100 rounded-md">
								<ul class="list-none">
									<li>PHP</li>
									<li>JavaScript</li>
									<li>Angular</li>
									<li>ReactJs</li>
									<li>HTML</li>
									<li>CSS</li>
									<li>Botstrap/TailWind</li>
									<li>Git</li>
								</ul>
							</div>
							
						</div>
					</div>
					{/if}
				{#if ruta == 'resume'}
					<div class="mt-10">
						<h1 class="text-4xl font-bold">Resume</h1>
						<div class="grid grid-cols-2 gap-4 py-8">
							<div class="bg-zinc-100 rounded-md p-3">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 p-2 bg-blue-200 rounded-md text-blue-800">
									<path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
								</svg>								  
							<h2 class="text-2xl font-bold mb-2">Education</h2>
							<div class="">
								<p class="text-xs text-gray-500">2015-2019</p>
								<p class="text-gray-700 font-bold">Ing. Tecnologias de la Informacion</p>
								<p>Universidad Tecnologica de los Valles Centrales de Oaxaca</p>
							</div>
							<hr>
							<div class="">
								<p class="text-xs text-gray-500">2012-2015</p>
								<p class="text-gray-700 font-bold">Bachillerato</p>
								<p>Universidad Tecnologica de los Valles Centrales de Oaxaca</p>
							</div>

							</div>
							<div class="bg-zinc-100 rounded-md p-3">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 p-2 bg-orange-200 rounded-md text-orange-800">
									<path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
								  </svg>								  
								<h2 class="text-2xl font-bold">Experience</h2>
							</div>
						</div>

					</div>
					{/if}
					{#if ruta == 'works'}
					<div>
						<h1>Portfolio</h1>
					</div>
				{/if}
			</div>
		</div>
	</div>
</main>
