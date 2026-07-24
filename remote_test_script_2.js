
        document.addEventListener('DOMContentLoaded', () => {
            const images = [
                'assets/images/alpine_status_main_v6.jpg',
                'assets/images/alpine_status_main_v7.jpg',
                'assets/images/alpine_status_main_v8.jpg'
            ];
            let currentIndex = 0;
            const sliceCount = 10;

            // Preload hero images to guarantee seamless zero-flicker transitions
            images.forEach(src => {
                const img = new Image();
                img.src = src;
            });

            const baseImg = document.getElementById('hero-base-img');
            const blindsContainer = document.getElementById('hero-blinds-container');

            function updateSlider() {
                const currentImgSrc = images[currentIndex];
                const nextIndex = (currentIndex + 1) % images.length;
                const nextImgSrc = images[nextIndex];

                // 1. Build slices with currentImgSrc using real <img> layers
                blindsContainer.innerHTML = '';
                const widthPerSlice = 100 / sliceCount;

                for (let i = 0; i < sliceCount; i++) {
                    const slice = document.createElement('div');
                    slice.classList.add('blind-slice');
                    slice.style.left = `${i * widthPerSlice}%`;
                    slice.style.width = `calc(${widthPerSlice}% + 0.8px)`; // 0.8px overlap to remove hairline gaps
                    slice.style.transform = 'scaleX(1)';

                    const img = document.createElement('img');
                    img.src = currentImgSrc;
                    img.classList.add('blind-slice-img');
                    img.style.left = `-${i * 100}%`;
                    img.style.width = `${sliceCount * 100}%`;
                    img.alt = 'Hero Slice';

                    slice.appendChild(img);
                    blindsContainer.appendChild(slice);
                }

                // 2. Set baseImg (underneath layer) to nextImgSrc
                baseImg.src = nextImgSrc;

                // 3. Trigger staggered blinds shrinking animation
                setTimeout(() => {
                    const slices = blindsContainer.querySelectorAll('.blind-slice');
                    slices.forEach((slice, i) => {
                        setTimeout(() => {
                            slice.style.transform = 'scaleX(0)';
                        }, i * 80); // Stagger 80ms per slice
                    });

                    // 4. Clean up blinds container after transition completes
                    setTimeout(() => {
                        blindsContainer.innerHTML = '';
                        currentIndex = nextIndex;
                    }, (sliceCount * 80) + 900);
                }, 50);
            }

            // Start slide interval every 5 seconds
            setInterval(updateSlider, 5000);
        });
    