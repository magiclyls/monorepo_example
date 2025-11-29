import type { Component } from 'vue'
import type { ProjectType } from './useCurrencyComponentConfig'
import { AfunBaseInput, PhBaseInput } from '@tg/bccomponents'

export const INPUT_COMPONENT_MAP: Record<ProjectType, Component> = {
  'ph-h5': PhBaseInput,
  'afun-h5': AfunBaseInput,
  'stake-h5': PhBaseInput,
}

export const DEFAULT_INPUT_COMPONENT = PhBaseInput

export function getInputSelectComponent(project: ProjectType): Component {
  return INPUT_COMPONENT_MAP[project] || DEFAULT_INPUT_COMPONENT
}
