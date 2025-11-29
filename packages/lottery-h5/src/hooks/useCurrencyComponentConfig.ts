import type { Component } from 'vue'
import { AfunBaseSelectCurrency, PhBaseSelectCurrency } from '@tg/bccomponents'

export type ProjectType = 'ph-h5' | 'afun-h5' | 'stake-h5'

export const CURRENCY_SELECT_COMPONENT_MAP: Record<ProjectType, Component> = {
  'ph-h5': PhBaseSelectCurrency,
  'afun-h5': AfunBaseSelectCurrency,
  'stake-h5': PhBaseSelectCurrency,
}

export const DEFAULT_CURRENCY_SELECT_COMPONENT = PhBaseSelectCurrency

export function getCurrencySelectComponent(project: ProjectType): Component {
  return CURRENCY_SELECT_COMPONENT_MAP[project] || DEFAULT_CURRENCY_SELECT_COMPONENT
}
