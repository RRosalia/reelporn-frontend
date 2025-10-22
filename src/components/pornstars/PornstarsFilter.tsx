'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import PornstarsRepository from '@/lib/repositories/PornstarsRepository';
import { PornstarFilters, FilterCountry, HeightRange, WeightRange, FilterOption } from '@/types/Pornstar';
import './PornstarsFilter.css';

interface PornstarsFilterProps {
  filters: PornstarFilters;
  onFilterChange: (filters: PornstarFilters) => void;
}

const PornstarsFilter: React.FC<PornstarsFilterProps> = ({ filters, onFilterChange }) => {
  const t = useTranslations();

  // Filter data state
  const [countries, setCountries] = useState<FilterCountry[]>([]);
  const [heightRange, setHeightRange] = useState<HeightRange>({ min: 100, max: 250 });
  const [weightRange, setWeightRange] = useState<WeightRange>({ min: 30, max: 200 });
  const [hairColors, setHairColors] = useState<FilterOption[]>([]);
  const [eyeColors, setEyeColors] = useState<FilterOption[]>([]);
  const [ethnicities, setEthnicities] = useState<FilterOption[]>([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Fetch filter data on mount
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        setLoading(true);
        const [
          countriesData,
          heightsData,
          weightsData,
          hairColorsData,
          eyeColorsData,
          ethnicitiesData
        ] = await Promise.all([
          PornstarsRepository.getFilterCountries(),
          PornstarsRepository.getFilterHeights(),
          PornstarsRepository.getFilterWeights(),
          PornstarsRepository.getFilterHairColors(),
          PornstarsRepository.getFilterEyeColors(),
          PornstarsRepository.getFilterEthnicities()
        ]);

        setCountries(countriesData);
        setHeightRange(heightsData);
        setWeightRange(weightsData);
        setHairColors(hairColorsData);
        setEyeColors(eyeColorsData);
        setEthnicities(ethnicitiesData);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterData();
  }, []);

  const handleInputChange = (key: keyof PornstarFilters, value: string | number | boolean | null | undefined) => {
    const newFilters = { ...filters };

    if (value === '' || value === null || value === undefined) {
      delete newFilters[key];
    } else {
      // Type assertion needed because TypeScript can't narrow the union type properly
      (newFilters as Record<string, string | number | boolean>)[key] = value as string | number | boolean;
    }

    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(filters).filter(key => key !== 'page' && key !== 'per_page').length > 0;

  if (loading) {
    return (
      <div className="pornstars-filter">
        <div className="filter-loading">
          <i className="bi bi-hourglass-split"></i>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pornstars-filter">
      <div className="filter-header">
        <h3>{t('pornstars.filters.title')}</h3>
        {hasActiveFilters && (
          <button
            className="filter-clear-btn"
            onClick={handleClearFilters}
            title={t('pornstars.filters.clearAll')}
          >
            <i className="bi bi-x-circle"></i>
          </button>
        )}
      </div>

      {/* Name Search */}
      <div className="filter-section">
        <label className="filter-label">
          <i className="bi bi-search"></i>
          {t('pornstars.filters.name')}
        </label>
        <input
          type="text"
          className="filter-input"
          placeholder={t('pornstars.filters.namePlaceholder')}
          value={filters.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
        />
      </div>

      {/* Age Filter */}
      <div className="filter-section">
        <label className="filter-label">
          <i className="bi bi-calendar"></i>
          {t('pornstars.filters.age')}
        </label>
        <div className="filter-range">
          <input
            type="number"
            className="filter-input filter-input-small"
            placeholder="Min"
            min="18"
            max="100"
            value={filters.min_age || ''}
            onChange={(e) => handleInputChange('min_age', e.target.value ? parseInt(e.target.value) : undefined)}
          />
          <span className="filter-range-separator">-</span>
          <input
            type="number"
            className="filter-input filter-input-small"
            placeholder="Max"
            min="18"
            max="100"
            value={filters.max_age || ''}
            onChange={(e) => handleInputChange('max_age', e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </div>
      </div>

      {/* Country Filter */}
      <div className="filter-section">
        <label className="filter-label">
          <i className="bi bi-globe"></i>
          {t('pornstars.filters.country')}
        </label>
        <select
          className="filter-select"
          value={filters.country_id || ''}
          onChange={(e) => handleInputChange('country_id', e.target.value ? parseInt(e.target.value) : undefined)}
        >
          <option value="">{t('pornstars.filters.allCountries')}</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name} {country.pornstars_count ? `(${country.pornstars_count})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Height Filter */}
      <div className="filter-section">
        <label className="filter-label">
          <i className="bi bi-arrows-vertical"></i>
          {t('pornstars.filters.height')} (cm)
        </label>
        <div className="filter-range">
          <input
            type="number"
            className="filter-input filter-input-small"
            placeholder={`${heightRange.min}`}
            min={heightRange.min}
            max={heightRange.max}
            value={filters.min_height || ''}
            onChange={(e) => handleInputChange('min_height', e.target.value ? parseInt(e.target.value) : undefined)}
          />
          <span className="filter-range-separator">-</span>
          <input
            type="number"
            className="filter-input filter-input-small"
            placeholder={`${heightRange.max}`}
            min={heightRange.min}
            max={heightRange.max}
            value={filters.max_height || ''}
            onChange={(e) => handleInputChange('max_height', e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </div>
      </div>

      {/* Weight Filter */}
      <div className="filter-section">
        <label className="filter-label">
          <i className="bi bi-speedometer"></i>
          {t('pornstars.filters.weight')} (kg)
        </label>
        <div className="filter-range">
          <input
            type="number"
            className="filter-input filter-input-small"
            placeholder={`${weightRange.min}`}
            min={weightRange.min}
            max={weightRange.max}
            value={filters.min_weight || ''}
            onChange={(e) => handleInputChange('min_weight', e.target.value ? parseInt(e.target.value) : undefined)}
          />
          <span className="filter-range-separator">-</span>
          <input
            type="number"
            className="filter-input filter-input-small"
            placeholder={`${weightRange.max}`}
            min={weightRange.min}
            max={weightRange.max}
            value={filters.max_weight || ''}
            onChange={(e) => handleInputChange('max_weight', e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </div>
      </div>

      {/* Hair Color Filter */}
      <div className="filter-section">
        <label className="filter-label">
          <i className="bi bi-palette"></i>
          {t('pornstars.filters.hairColor')}
        </label>
        <select
          className="filter-select"
          value={filters.hair_color || ''}
          onChange={(e) => handleInputChange('hair_color', e.target.value || undefined)}
        >
          <option value="">{t('pornstars.filters.allHairColors')}</option>
          {hairColors.map((color) => (
            <option key={color.value} value={color.value}>
              {color.label} {color.count ? `(${color.count})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Eye Color Filter */}
      <div className="filter-section">
        <label className="filter-label">
          <i className="bi bi-eye"></i>
          {t('pornstars.filters.eyeColor')}
        </label>
        <select
          className="filter-select"
          value={filters.eye_color || ''}
          onChange={(e) => handleInputChange('eye_color', e.target.value || undefined)}
        >
          <option value="">{t('pornstars.filters.allEyeColors')}</option>
          {eyeColors.map((color) => (
            <option key={color.value} value={color.value}>
              {color.label} {color.count ? `(${color.count})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Ethnicity Filter */}
      <div className="filter-section">
        <label className="filter-label">
          <i className="bi bi-person"></i>
          {t('pornstars.filters.ethnicity')}
        </label>
        <select
          className="filter-select"
          value={filters.ethnicity || ''}
          onChange={(e) => handleInputChange('ethnicity', e.target.value || undefined)}
        >
          <option value="">{t('pornstars.filters.allEthnicities')}</option>
          {ethnicities.map((ethnicity) => (
            <option key={ethnicity.value} value={ethnicity.value}>
              {ethnicity.label} {ethnicity.count ? `(${ethnicity.count})` : ''}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PornstarsFilter;
