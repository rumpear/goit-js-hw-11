import axios from 'axios';

export default class PixabayApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImg() {
    const BASE_URL = 'https://pixabay.com/api';
    const API_KEY = '12565678-dacc4bb7fef27484506aaaffc';
    const SEARCH_OPTIONS = 'image_type=photo&orientation=horizontal&safesearch=true';

    // console.log(this.page);

    // * axios
    try {
      const response = await axios.get(
        `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&${SEARCH_OPTIONS}&page=${this.page}&per_page=40`,
      );
      this.incrementPage();
      // console.log(response.data);
      return await response.data;
    } catch (error) {}

    // * async-await
    // try {
    //   const response = await fetch(
    //     `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&${SEARCH_OPTIONS}&page=${this.page}&per_page=40`,
    //   );
    //   this.incrementPage();
    //   return await response.json();
    // } catch (error) {
    //   // console.log(error);
    // }

    // * fetch-then
    // fetchImg() {
    //   const BASE_URL = 'https://pixabay.com/api';
    //   const API_KEY = '12565678-dacc4bb7fef27484506aaaffc';
    //   const SEARCH_OPTIONS = 'image_type=photo&orientation=horizontal&safesearch=false';

    //   console.log(this.page);

    //   return fetch(
    //     `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&${SEARCH_OPTIONS}&page=${this.page}&per_page=40`,
    //   ).then(response => {
    //     this.incrementPage();
    //     return response.json();
    //   });
    // }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
