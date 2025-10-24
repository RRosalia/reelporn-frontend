/**
 * PaginatedResponse class for handling Laravel paginated API responses
 *
 * @template T - The type of data items in the response
 */

interface PaginatedLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

interface PaginatedMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
  links?: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
}

interface PaginatedResponseData<T> {
  data: T[];
  links: PaginatedLinks;
  meta: PaginatedMeta;
}

export class PaginatedResponse<T = unknown> {
  data: T[];
  links: PaginatedLinks;
  meta: PaginatedMeta;

  constructor(response: PaginatedResponseData<T>) {
    this.data = response.data || [];
    this.links = response.links || {
      first: null,
      last: null,
      prev: null,
      next: null,
    };
    this.meta = response.meta || {
      current_page: 1,
      from: 0,
      last_page: 1,
      path: '',
      per_page: 15,
      to: 0,
      total: 0,
    };
  }

  /**
   * Get the data items
   * @returns {Array}
   */
  getData(): T[] {
    return this.data;
  }

  /**
   * Get current page number
   * @returns {number}
   */
  getCurrentPage(): number {
    return this.meta.current_page || 1;
  }

  /**
   * Get last page number
   * @returns {number}
   */
  getLastPage(): number {
    return this.meta.last_page || 1;
  }

  /**
   * Get total items count
   * @returns {number}
   */
  getTotal(): number {
    return this.meta.total || 0;
  }

  /**
   * Get per page limit
   * @returns {number}
   */
  getPerPage(): number {
    return this.meta.per_page || 15;
  }

  /**
   * Check if there is a next page
   * @returns {boolean}
   */
  hasNextPage(): boolean {
    return this.links.next !== null;
  }

  /**
   * Check if there is a previous page
   * @returns {boolean}
   */
  hasPrevPage(): boolean {
    return this.links.prev !== null;
  }

  /**
   * Get next page URL
   * @returns {string|null}
   */
  getNextPageUrl(): string | null {
    return this.links.next;
  }

  /**
   * Get previous page URL
   * @returns {string|null}
   */
  getPrevPageUrl(): string | null {
    return this.links.prev;
  }

  /**
   * Get first page URL
   * @returns {string|null}
   */
  getFirstPageUrl(): string | null {
    return this.links.first;
  }

  /**
   * Get last page URL
   * @returns {string|null}
   */
  getLastPageUrl(): string | null {
    return this.links.last;
  }

  /**
   * Get pagination links
   * @returns {Array}
   */
  getPaginationLinks() {
    return this.meta.links || [];
  }

  /**
   * Check if response is empty
   * @returns {boolean}
   */
  isEmpty(): boolean {
    return this.data.length === 0;
  }

  /**
   * Get from index
   * @returns {number}
   */
  getFrom(): number {
    return this.meta.from || 0;
  }

  /**
   * Get to index
   * @returns {number}
   */
  getTo(): number {
    return this.meta.to || 0;
  }
}
