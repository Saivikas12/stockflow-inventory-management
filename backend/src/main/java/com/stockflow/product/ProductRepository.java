package com.stockflow.product;
import org.springframework.data.jpa.repository.*; import org.springframework.data.repository.query.Param; import java.util.*;
public interface ProductRepository extends JpaRepository<Product,Long>{
 List<Product> findAllByOrganization_IdOrderByUpdatedAtDesc(Long orgId);
 Optional<Product> findByIdAndOrganization_Id(Long id,Long orgId);
 boolean existsByOrganization_IdAndSkuIgnoreCase(Long orgId,String sku);
 boolean existsByOrganization_IdAndSkuIgnoreCaseAndIdNot(Long orgId,String sku,Long id);
 long countByOrganization_Id(Long orgId);
 @Query("select coalesce(sum(p.quantity),0) from Product p where p.organization.id=:orgId") Long totalQuantity(@Param("orgId") Long orgId);
}
