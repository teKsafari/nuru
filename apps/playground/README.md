# nuru-playground
Interactive playground for nuru


### Healthchecks

For deployments with docker, healthcheks must be run against `/${locale}` eg `/sw/` not `/` which will return a redirect. Redirects are 'bad' as far as healthchecks are concerned. 