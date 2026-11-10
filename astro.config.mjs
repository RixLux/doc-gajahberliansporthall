// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';

// https://astro.build/config
export default defineConfig({
	site: 'https://RixLux.github.io',
	base: '/doc-gajahberliansporthall',

	integrations: [
		mermaid(),
							starlight({
								title: 'Gajah Berlian Sports Hall',
								description: 'Developer & Deployment Documentation for Gajah Berlian Sports Hall Platform',
								social: [
									{ icon: 'github', label: 'GitHub', href: 'https://github.com/RixLux/doc-gajahberliansporthall' },
								],
								sidebar: [
									{
										label: 'Getting Started',
										items: [
											{ label: 'Introduction', slug: 'getting-started/introduction' },
											{ label: '5-Minute Quickstart', slug: 'getting-started/quickstart' },
											{ label: 'Role Capabilities Matrix', slug: 'getting-started/roles-capabilities' },
										],
									},
									{
										label: 'Architecture & Design',
										items: [
											{ label: 'System Architecture', slug: 'architecture/system-design' },
											{ label: 'Concurrency & Locking', slug: 'architecture/concurrency-and-locking' },
										],
									},
									{
										label: 'Development Guide',
										items: [
											{ label: 'Backend (NestJS & Clean Arch)', slug: 'development/backend' },
									  { label: 'Frontend (React & Vite)', slug: 'development/frontend' },
									  { label: 'Testing & Verification', slug: 'development/testing' },
									  { label: 'Contributing & Git Workflow', slug: 'development/contributing' },
										],
									},
									{
										label: 'Deployment & Operations',
										items: [
											{ label: 'Deployment Overview', slug: 'deployment/overview' },
											{ label: 'Frontend Deployment (Vercel)', slug: 'deployment/frontend-vercel' },
									  { label: 'Backend Deployment (Docker & VPS)', slug: 'deployment/backend-docker' },
									  { label: 'Midtrans Payment Gateway', slug: 'deployment/midtrans-setup' },
										],
									},
								],
							}),
	],
});
