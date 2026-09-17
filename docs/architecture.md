# Production-scale architecture

```text
                    ┌─────────────────────────┐
                    │       Cloud CDN         │
                    │   Static assets/images  │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   React / Next.js Web    │
                    │ SSR + client interactions│
                    └────────────┬────────────┘
                                 │ HTTPS
                 ┌───────────────▼────────────────┐
                 │       API Gateway / BFF         │
                 └───────┬──────────┬─────────────┘
                         │          │
              ┌──────────▼───┐  ┌──▼─────────────┐
              │ Auth Service  │  │ Listing Service │
              │ OAuth/JWT     │  │ CRUD + pricing  │
              └───────────────┘  └──┬─────────────┘
                                     │
                       ┌─────────────▼────────────┐
                       │      Search Service       │
                       │ OpenSearch / Elasticsearch│
                       └─────────────┬────────────┘
                                     │
                  ┌──────────────────▼──────────────────┐
                  │           Primary Database           │
                  │ PostgreSQL / read replicas / shard  │
                  └───────────────┬─────────────────────┘
                                  │
                ┌─────────────────▼─────────────────┐
                │      Object Storage + CDN         │
                │   Photos / videos / documents     │
                └───────────────────────────────────┘

Supporting infrastructure:
- Redis: sessions, hot listing cache, rate limiting
- Queue: Kafka/SQS for notifications, indexing, analytics
- Observability: logs, metrics, tracing, alerting
- Deployment: Docker + Kubernetes or managed containers
- CI/CD: GitHub Actions / equivalent private pipeline
```

The assignment specifically asks for a high-level architecture showing scaling for frontend, backend, storage, search and deployment. The diagram above is intentionally technology-agnostic enough to adapt to a production stack.